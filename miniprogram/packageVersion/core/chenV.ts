import { AngleComputeFilter } from "./angle/angleCompute"
import FrameRender from "./render/frameRender"
import Detector from "./detector/detector"
import { CDN } from "../../api/config"
import { calculateDistance } from "./angle/mathTools"
import { CvOptionsEmitFlag } from "./options/index"
// const app = getApp<IAppOption>()
/**
 * @author Wang Chen
 * @description 视觉算法总管理器
 */
export default class ChenV {
  private state = {
    cvCheck: false,
    angle: 0,
    label: "",
    direction: "",
    videoSrc: ""
  }
  private detectAngleType!: detectAngleType
  private detectorType!: detectType
  private detector!: Detector
  private fps = 30
  private angleComputeFilter = new AngleComputeFilter()
  private wxPage!: WechatMiniprogram.Page.Instance<{}, any>
  private frameRender = new FrameRender()
  private angleRender!: drawAngle
  private videoCtx!: WechatMiniprogram.VideoContext
  finish = false
  private ifKeepCV = false
  private frameCVTimer!: number | null
  private removeIntervals = 70
  frameCheckDirection!: "front" | "side"
  private audioCtx!: WechatMiniprogram.InnerAudioContext
  private maxAngle = 0
  optionsQueue: CvOption[] = []
  oneActionPlayTimes = 0
  detectResAngle: number[] = []
  currentSeconds = 0
  optionsRun = false
  optionsRecord: CvOptionRecord[] = []

  constructor(wxPage: WechatMiniprogram.Page.Instance<{}, any>, videoCtx: WechatMiniprogram.VideoContext) {
    this.wxPage = wxPage
    this.videoCtx = videoCtx
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
    })

    this.audioCtx = wx.createInnerAudioContext()

    this.audioCtx.onError((err) => {
      console.error('audio error', err);
    })

    this.audioCtx.onPlay(() => {
      console.log('audio play');
    })

    this.detector = new Detector()
    this.detector.bindDetect = (data) => {
      this.getDetectingData(data)
    }
    // 数据注入
    this.wxPage.setData({
      ...this.state
    })
  }

  async renderFrameCanvas(canvasId: string) {
    const wxPage = this.wxPage
    const query = wxPage.createSelectorQuery()
    await this.frameRender.init(query, canvasId)
  }

  setOptions(options: Record<string, CvOption>) {
    let queue = []
    for (let key in options) {
      const option = options[key]
      queue.push(option)
    }
    this.optionsQueue = queue
  }

  setCurrentSeconds(value: number) {
    this.currentSeconds = value
  }

  bindAngleDrawer(drawer: drawAngle) {
    this.angleRender = drawer
    this.angleRender.outputResult = (res) => {
      this.setDetectAngleRes(res)
    }
  }

  setDetectAngleRes(res: number[]) {
    this.detectResAngle = res
  }

  setFrameCheckDirection(frameCheckDirection: "front" | "side") {
    this.frameCheckDirection = frameCheckDirection
  }

  setDetectAngleType(type: detectAngleType, direction: "left" | "right" = "left") {
    this.detectAngleType = type
    this.finish = true
    this.oneActionPlayTimes = 0
    this.maxAngle = 0
    this.detectResAngle = []
    const faceTypeMode: string | string[] = []
    const bodyTypeMode: detectAngleType[] = ["neckBend", "neckRotate", "neckRoll", "legLift", "headLift", "headBackLift", "lumbarExtension", "lumbarRoll", "snowAngel"]
    this.angleComputeFilter.setDetectAngleType(this.detectAngleType)
    this.angleComputeFilter.setDirection(direction)
    this.wxPage.setData({
      videoSrc: this.angleComputeFilter.getVideoSrc(direction)
    })
    this.videoCtx.pause()
    if (faceTypeMode.includes(type)) {
      this.setDetectDataByType("face")
    } else if (bodyTypeMode.includes(type)) {
      this.setDetectDataByType("body")
    }
  }

  /**
   * 
   * @param type 检测模型类型
   * @description 若类型不同会先销毁之前的detector模型
   * 
   */
  private setDetectDataByType(type: detectType) {
    this.detectorType = type
  }

  private getDetectingData(data: any) {
    //描绘身体轮廓
    if (this.ifKeepCV) {
      return this.detectBodyInFrame(data)
    }
    if (this.finish) return
    if (this.detector.detectType === "body") {
      this.frameRender.renderBodyFrame(data)
    } else if (this.detector.detectType === "face") {
      this.frameRender.renderFaceFrame(data)
    }

    //计算角度数据
    const angle = this.computeAngleByData(data)
    // if (this.maxAngle < angle) this.maxAngle = angle
    // if (this.angleRender) {
    //     this.angleRender.setAngle(angle)
    // }

    //判断当前cv状态
    this.judgeCvResultState(data, angle)

    //完成检测相关操作
    this.checkToOptions(angle, data)

  }

  //执行操作队列
  private async checkToOptions(angle: any, data: any) {
    if (this.optionsRun) return //拒绝同步检测所有问题
    const that = this
    const { points } = data[0]
    if (!angle || !points) return
    const deleteQueue: CvOption[] = []
    for (let item of this.optionsQueue) {
      const { emit, once, options, lastEmitTime, interval } = item
      //调用时间间隔
      const now = Date.now()
      if ((lastEmitTime && interval) && now < lastEmitTime + interval * 1000) {
        continue
      }
      //判断触发
      const emitRes = emit(angle, points, this.currentSeconds)
      if (once && emitRes === CvOptionsEmitFlag.EMIT || emitRes === CvOptionsEmitFlag.DELETE) {
        deleteQueue.push(item)
      }
      if (emitRes === CvOptionsEmitFlag.EMIT) {
        const optionsRunner = () => options(function (option: CvOption) {
          that.addCvOptionsRecord(option, option.data, that.currentSeconds)
          that.setSubtitle(option.data)
        })
        item.lastEmitTime = now
        this.runOptions(optionsRunner)
        break
      }
    }
    this.optionsQueue = this.optionsQueue.filter((item) => {
      return !deleteQueue.includes(item)
    })
  }

  addCvOptionsRecord(cvOption: CvOption, data: any, second: number) {
    const record: CvOptionRecord = {
      cvOption,
      data,
      second,
    }
    this.optionsRecord.push(record)
  }

  setSubtitle(value: string) {
    this.wxPage.setData({
      subtitle: value
    })
  }

  private async runOptions(fn: any) {
    this.optionsRun = true
    await fn()
    setTimeout(() => {
      this.setSubtitle("")
      this.optionsRun = false
    }, 1500);
  }

  private computeAngleByData(data: any) {
    let angleData: any;
    try {
      angleData = this.angleComputeFilter.compute(data)
    } catch (err) {
      console.warn(err);
      angleData = {
        angle: 0
      }
    }
    let angle = angleData.angle
    if (!this.wxPage.data.cvCheck) {
      angle = Array.isArray(angle) ? [0, 0] : 0
    }
    return angle
  }

  private judgeCvResultState(data: any, angle: number) {
    if (!this.cvCheckProcessData(data) && angle == 0) {
      if (this.wxPage.data.cvCheck) {
        this.playReCvAudio()
      }
      this.wxPage.setData({
        cvCheck: false,
        frameCheck: `${this.frameCheckDirection}_error`
      })
      this.videoCtx.pause()
      return false
    } else if (data) {
      this.wxPage.setData({
        cvCheck: true,
        frameCheck: false
      })
      this.audioCtx.stop()
      if (!this.finish) {
        this.videoCtx.play()
      }
      return true
    }
    return false
  }

  private playReCvAudio() {
    if (this.frameCheckDirection === "front") {
      this.audioCtx.src = "https://vcos.changan-health.com/thi/webapp/20251130/8.mp3"
    } else {
      this.audioCtx.src = CDN + "/public/audios/sideReCV.MP3"
    }
    this.audioCtx.play()
  }

  private detectBodyInFrame(data: any) {
    if (this.frameCVTimer) return
    if (this.cvCheckProcessData(data)) {
      let seconds = 5
      this.wxPage.setData({
        frameCheck: this.frameCheckDirection
      })
      this.frameCVTimer = setInterval(() => {
        if (seconds === 2) {
          this.wxPage.setData({
            frameCheck: `${this.frameCheckDirection}_success`
          })
        }
        else if (seconds === 0) {
          this.wxPage.setData({
            frameCheck: false,
            cvCheck: true,
          })
          this.finishFrameCVcheck()
          this.keepCV(false)
          const timer: any = this.frameCVTimer
          clearInterval(timer)
          this.frameCVTimer = null
        }
        seconds--
      }, 1000)
    } else {
      clearInterval(this.frameCVTimer!)
      this.frameCVTimer = null
      this.wxPage.setData({
        frameCheck: `${this.frameCheckDirection}_error`
      })
    }
  }

  private cvCheckProcessData(data: any) {
    if (!data) return this.detectNoBody()
    const origin = data[0].origin
    const size = data[0].size
    const points = data[0].points
    const values = [points[0].x, points[0].y, points[5].x, points[5].y, points[6].x, points[6].y, origin.x + size.width, (origin.y + size.height) * 0.8]
    for (let item of values) {
      if (item > 1 || item < 0) {
        return this.detectNoBody()
      }
    }
    if (this.frameCheckDirection == "side") {
      const p1 = {
        x: (points[6].x + points[5].x) / 2,
        y: (points[6].y + points[5].y) / 2,
      }
      const p2 = {
        x: (points[12].x + points[11].x) / 2,
        y: (points[12].y + points[11].y) / 2,
      }
      const l1 = calculateDistance(points[6], points[5])
      const l2 = calculateDistance(p1, p2)
      const referValue = l1 / l2
      if (this.ifKeepCV && referValue > 0.35) {
        console.log("not side");
        return this.detectNoBody()
      }
    }
    this.removeIntervals = 70
    return true
  }

  private detectNoBody() {
    this.removeIntervals--
    if (this.removeIntervals < 0) {
      this.removeIntervals = -1
      return false
    }
    return true
  }

  async startDetect() {
    this.finish = false
    await this.detector.init(this.detectorType)
    this.detector.setFps(this.fps)
    this.detector.start()
  }

  stopDetect() {
    this.detector.stop()
    this.audioCtx.destroy()
  }

  startFrameCVcheck() {
    this.keepCV(true)
    this.wxPage.setData({
      cvCheck: false
    })
    this.setDetectDataByType("body")
    if (this.frameCheckDirection === "front") {
      this.audioCtx.src = "https://vcos.changan-health.com/thi/webapp/20251130/9.mp3"
    } else {
      this.audioCtx.src = CDN + "/public/audios/sideCV.MP3"
    }
    this.audioCtx.play()
  }

  private keepCV(cv: boolean) {
    this.ifKeepCV = cv
    this.wxPage.setData({
      videoSrc: ""
    })
  }



  detectFinish(result: number[]) {
    const that = this
    const audio = wx.createInnerAudioContext()
    this.finish = true
    audio.src = CDN + "/public/audios/dingDone.MP3"
    this.videoCtx.stop()
    audio.play()
    audio.onEnded(end)
    function end() {
      that.finishOneStep(that.getSuitableValue(result))
      audio.offEnded(end)
    }
  }

  outputGroupValue() {
    this.detectFinish([this.maxAngle])
  }

  reset() {
    this.setCurrentSeconds(0)
    this.setOptions({})
    this.optionsRecord = []
    this.optionsRun = false
  }

  private getSuitableValue(arr: number[]) {
    // 计算数组的平均值
    var avg = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    // 初始值设为数组的第一个数，作为最接近平均值的数
    return arr.reduce((closest, current) => Math.abs(current - avg) < Math.abs(closest - avg) ? current : closest, arr[0]);
  }

  finishOneStep(_angle: number) { }
  finishFrameCVcheck() { }
}