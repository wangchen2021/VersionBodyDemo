import ChenV from "./chenV";
import { CDN } from "../../api/config"
import { getFlexSubmitParam } from "./plan/estimatePlan";
const app = getApp<IAppOption>()
enum stateCode {
  TEACH_VIDEO,
  CV_CHECK_FRONT,
  VIDEO_CHECK_SIDE,
  CV_CHECK_SIDE,
  SHOW_RULE,
  ACTION_LEFT,
  ACTION_RIGHT,
  FINISH
}
/**
 * @author Wang Chen
 * @description 总状态机
 */
export class VersionState {
  private chenV!: ChenV
  private plans!: estimatePlanItem[]
  private videoCtx!: WechatMiniprogram.VideoContext
  private state: stateCode = stateCode.CV_CHECK_FRONT
  private wxPage!: WechatMiniprogram.Page.Instance<{}, any>
  private frameCanvasId!: string
  private angleCanvasId!: string
  private result: number[] = []
  private maxDetectTimesOneAction = 3
  init(wxPage: WechatMiniprogram.Page.Instance<{}, any>, plans: estimatePlanItem[], videoId: string, frameCanvasId: string, angleCanvasId: string) {
    if (!wx.isVKSupport("v1")) {
      wx.showToast({
        title: "当前设备暂不支持视觉AI功能",
        duration: 5000,
        icon: "none"
      })
      return
    }
    this.wxPage = wxPage
    this.plans = plans
    const videoCtx = wx.createVideoContext(videoId)
    this.videoCtx = videoCtx
    this.frameCanvasId = frameCanvasId
    this.angleCanvasId = angleCanvasId
    this.chenV = new ChenV(wxPage, videoCtx)
    this.chenV.finishOneStep = (angle) => {
      this.finishStep(angle)
    }
    this.chenV.finishFrameCVcheck = () => {
      this.frameCVcheckFinish()
    }
  }

  start() {
    this.processState()
  }

  setChenVSecond(value: number) {
    this.chenV.setCurrentSeconds(value)
  }

  private async processState() {
    if (!this.plans || this.plans.length === 0) {
      this.state = stateCode.FINISH
      app.globalData.flexData = getFlexSubmitParam(this.result, app.globalData.selectEstimatePlan)
      //todo 结果处理
      return
    } else if (this.plans[0].checkDirection === 'side' && this.chenV.frameCheckDirection === "front") {
      this.state = stateCode.CV_CHECK_SIDE
    }
    const estimateAngle = async (name: detectAngleType, direction: "left" | "right", maxValue: number, angelDrawer: drawAngle, audioSrc: string, options: Record<string, CvOption> | undefined) => {
      this.wxPage.showVideoFilter()
      this.chenV.setDetectAngleType(name, direction)
      if (options) {
        this.chenV.setOptions(options)
      }
      const query = this.wxPage.createSelectorQuery()
      angelDrawer.maxValue = maxValue
      await angelDrawer.init(query, this.angleCanvasId)
      this.chenV.bindAngleDrawer(angelDrawer)
      const audio = wx.createInnerAudioContext()
      audio.src = audioSrc
      audio.autoplay = true
      audio.play()
      audio.onError((err) => {
        console.log(`${audioSrc} play error:`, err);
        console.log(audio);
        audio.play()
      })
      audio.onEnded(() => {
        console.log("name audio play end");
        this.chenV.finish = false
        this.videoCtx.play()
        audio.destroy()
      })
    }
    const { name, detectMaxValue, detectShape, checkDirection, nameAudios, options } = this.plans[0]
    switch (this.state) {
      case stateCode.TEACH_VIDEO:
        this.wxPage.setData({
          videoSrc: "https://cos.painspective.com/jizhi/miniProgram/public/video0423/后退55.mp4",
        })
        this.videoCtx.play()
        break
      case stateCode.CV_CHECK_FRONT:
        console.log('cv_check_front');
        this.wxPage.setData({
          cvCheck: false,
          showCamera: true,
          frameCheck: checkDirection,
        })
        await this.chenV.renderFrameCanvas(this.frameCanvasId)
        this.chenV.setFrameCheckDirection(this.plans[0].checkDirection)
        this.chenV.startFrameCVcheck()
        this.chenV.startDetect()
        break
      case stateCode.SHOW_RULE:
        console.log('show_rule');
        this.wxPage.setData({
          videoSrc: "https://cos.painspective.com/jizhi/miniProgram/public/video0423/规则.mp4",
        })
        this.videoCtx.play()
        break
      case stateCode.VIDEO_CHECK_SIDE:
        console.log("video_cv_side");
        this.wxPage.setData({
          videoSrc: CDN + "/public/video0423/侧转身.mp4",
        })
        this.videoCtx.play()
        break
      case stateCode.CV_CHECK_SIDE:
        console.log('cv_check_sideo');
        this.wxPage.setData({
          cvCheck: false,
          showCamera: true,
          frameCheck: checkDirection,
        })
        this.chenV.setFrameCheckDirection(this.plans[0].checkDirection)
        this.chenV.startFrameCVcheck()
        break
      case stateCode.ACTION_LEFT:
        estimateAngle(name, "left", detectMaxValue["left"], detectShape["left"], nameAudios["left"], options)
        break
      case stateCode.ACTION_RIGHT:
        estimateAngle(name, "right", detectMaxValue["right"], detectShape["right"], nameAudios["right"], options)
        break
    }
  }

  private frameCVcheckFinish() {
    if (this.chenV.frameCheckDirection == "front") {
      this.state = stateCode.ACTION_LEFT
      this.videoCtx.stop()
    } else {
      this.state = stateCode.ACTION_LEFT
    }
    this.processState()
  }

  private finishStep(angle: number) {
    console.log("采集完成，角度为", angle);
    this.result.push(angle)
    if (this.state === stateCode.ACTION_LEFT) {
      this.state = stateCode.ACTION_RIGHT
    }
    else {
      this.plans.shift()
      this.state = stateCode.ACTION_LEFT
    }
    this.videoCtx.stop()
    this.processState()
  }

  onVideoEnd() {

    this.chenV.reset()

    //教学视频结束
    if (this.state === stateCode.TEACH_VIDEO) {
      this.state = stateCode.CV_CHECK_FRONT
      this.videoCtx.stop()
      this.processState()
    }

    else if (this.state === stateCode.SHOW_RULE) {
      this.state = stateCode.ACTION_LEFT
      this.videoCtx.stop()
      this.processState()
    }

    else if (this.state === stateCode.VIDEO_CHECK_SIDE) {
      this.state = stateCode.ACTION_LEFT
      this.chenV.setFrameCheckDirection("side")
      this.processState()
    }

    else if (this.state === stateCode.ACTION_LEFT || this.state === stateCode.ACTION_RIGHT) {
      this.chenV.oneActionPlayTimes = this.chenV.oneActionPlayTimes + 1
      //输出检测度数
      if (this.chenV.detectResAngle.length > 0) {
        this.chenV.detectFinish(this.chenV.detectResAngle)
        return
      }
      //超过次数
      if (this.chenV.oneActionPlayTimes >= this.maxDetectTimesOneAction) {
        this.chenV.outputGroupValue()
        return
      }
    }
  }

  stop() {
    this.videoCtx.stop()
    this.chenV.stopDetect()
  }
}