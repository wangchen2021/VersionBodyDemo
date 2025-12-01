type points2d = {
  x: number,
  y: number,
}

type points3d = {
  x: number,
  y: number,
  z: number
}

type detectType = "body" | "face"

/**
 * @description 角度检测类型 依次为：1.颈部左右侧屈 2.颈部左右旋 3.颈部前屈后伸
 * 4.主动屈髋  5.主动单臂屈曲 6.主动单臂后伸 7.腰椎前屈后伸 8.腰椎侧屈
 */
type detectAngleType = "neckBend" | "neckRotate" | "neckRoll"
  | "legLift" | "headLift" | "headBackLift" | "lumbarExtension"
  | "lumbarRoll" | "snowAngel"



interface drawAngle {
  ctx: WechatMiniprogram.RenderingContext;
  width: number;
  height: number;
  angle: number
  maxValue: number
  progress: number
  fps: number
  loopRotate: number
  rotateSpeed: number
  finishProgress: number
  finishProgressSpeed: number
  result: number[]
  rotateLoopShowProgress: number,
  init(query: WechatMiniprogram.SelectorQuery, canvasId: string): Promise<any>,
  setAngle(angle: number): void
  outputResult(result: number[]): any
  drawBottomRemainTime(value: number): void
}

/**
 * @description 检测项目
 */
type estimatePlanItem = {
  value: number,
  name: detectAngleType
  label: string,
  checkDirection: "front" | "side",
  detectMaxValue: {
    left: number
    right: number
  },
  detectShape: {
    left: drawAngle,
    right: drawAngle
  }
  videoSrc: {
    left: string,
    right: string,
    one?: string
  },
  nameAudios: {
    left: string,
    right: string
  },
  coverImg: {
    left: string,
    right: string
  },
  photoName: {
    left: string,
    right: string
  },
  reportShowData: ReportShowData[],
  options?: Record<string, CvOption>
}

type CvOption = {
  emit: Function,
  once: Boolean,
  options: Function,
  data: any,
  lastEmitTime?: number,
  interval?: number
}

type CvOptionRecord = {
  cvOption: CvOption
  data: any,
  second: number,
}

type ReportShowData = {
  name: string,
  img: string,
  h1: string,
  angle: ReportShowDataAngle[],
  content: null | string
}

type ReportShowDataAngle = {
  preText: string
  referValue: number
  label: string
}