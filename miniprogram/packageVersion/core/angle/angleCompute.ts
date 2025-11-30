import { calculateAngleBetweenVectors, turnPiToAngle } from "./mathTools"
import { CDN } from "../../../api/config"

const videoPre = CDN + "/public/video0724"
interface AngleUtils {
  label: string
  direction: "front" | "side"
  videoSrc: AnyObject
  compute: Function
}

/**
 * @description 角度计算过滤器
 */
export class AngleComputeFilter {
  private detectAngleType!: detectAngleType
  private Filters: Record<detectAngleType, any> = {
    neckBend: new NeckBendFilter(),
    neckRotate: new NeckRotateFilter(),
    neckRoll: new NeckRollFilter(),
    legLift: new LegLiftFilter(),
    headLift: new HeadLiftFilter(),
    headBackLift: new HeadBackLiftFilter(),
    lumbarExtension: new LumbarExtensionFilter(),
    lumbarRoll: new LumbarRollFilter(),
    snowAngel: new SonwAngleFilter()
  }
  private filter!: AngleUtils
  direction!: "left" | "right"
  setDetectAngleType(type: detectAngleType) {
    console.log('detect_type:' + type);
    this.detectAngleType = type
    this.filter = this.Filters[this.detectAngleType]
  }

  setDirection(direction: "left" | "right") {
    this.direction = direction
  }

  getLabel() {
    if (this.filter) {
      return this.filter.label
    }
    return null
  }

  getDitection() {
    if (this.filter) {
      return this.filter.direction
    }
    return null
  }

  getVideoSrc(direction: "left" | "right" = "left") {
    if (this.filter) {
      return this.filter.videoSrc[direction]
    }
    return null
  }

  compute(data: any) {
    if (!this.filter) return { angle: 0 }
    let res = this.filter.compute(data, this.direction)
    if (Array.isArray(res)) {
      return {
        angle: [Math.round(res[0]), Math.round(res[1])]
      }
    } else {
      const angle = Math.round(res)
      return {
        angle,
      }
    }
  }
}

/**
 * @description 脖子左右侧屈
 */
export class NeckBendFilter implements AngleUtils {
  direction: "front" | "side" = "front"
  label = "颈部左右侧屈"
  videoSrc = {
    left: videoPre + "/颈部左侧侧屈.mp4",
    right: videoPre + "/颈部右侧侧倾.mp4"
  }
  compute(data: any, direction: "left" | "right" = "left") {
    if (!data) {
      return 0
    }
    const points = data[0].points
    const point1 = points[0]
    const point2 = { x: (points[6].x + points[5].x) / 2, y: (points[6].y + points[5].y) / 2 }
    const diffX = point1.x - point2.x
    const diffY = point1.y - point2.y
    const v1 = { x: diffX, y: diffY }
    const v2 = { x: 0, y: 1 }
    if (point1.x > point2.x && direction === "left") return 0
    if (point1.x < point2.x && direction === "right") return 0
    let angle = calculateAngleBetweenVectors(v1, v2)
    if (angle > 90) angle = 180 - angle
    if (angle < 0) angle = 0
    return angle
  }
}
/**
 * @description 颈部左右旋
 */
export class NeckRotateFilter implements AngleUtils {
  maxReferValue = 0
  direction: "front" | "side" = "front"
  label = "颈部左右旋"
  videoSrc = {
    left: videoPre + "/颈部左侧旋转.mp4",
    right: videoPre + "/颈部右侧旋转.mp4"
  }
  compute(data: any, direction: "left" | "right" = "left") {
    if (!data) {
      return 0
    }
    const points = data[0].points
    const point4 = points[4]
    const point3 = points[3]
    const point5 = points[5]
    const point6 = points[6]
    const midPoint = { x: (point5.x + point6.x) / 2, y: (point5.y + point6.y) / 2 }
    const diffX = Math.abs(point4.x - point3.x)
    const diffReferX = Math.abs(point6.x - point5.x)
    const maxReferValue = diffX / diffReferX
    if (this.maxReferValue < maxReferValue) {
      this.maxReferValue = maxReferValue
      return 0
    } else {
      if (points[0].x > midPoint.x - 0.1 * diffX && direction === "left") {
        return 0
      }
      if (points[0].x < midPoint.x + 0.1 * diffX && direction === "right") {
        return 0
      }
      const realLength = diffReferX * this.maxReferValue
      let angle = turnPiToAngle(Math.acos(diffX / realLength))
      return angle
    }
  }
}

/**
 * @description 颈部前屈后伸
 */
export class NeckRollFilter implements AngleUtils {
  direction: "front" | "side" = "front"
  label = "颈部前屈后伸"
  videoSrc = {
    left: videoPre + "/颈椎屈曲低头.mp4",
    right: videoPre + "/颈部后伸后仰.mp4",
  }

  compute(data: any, direction: "left" | "right" = "left") {
    if (!data) {
      return 0
    }
    let points = data[0].points
    const point1 = points[3]
    const point2 = { x: (points[6].x + points[5].x) / 2, y: (points[6].y + points[5].y) / 2 }
    const point3 = { x: (points[12].x + points[11].x) / 2, y: (points[12].y, points[11].y) / 2 }
    const diffX = point1.x - point2.x
    const diffY = point1.y - point2.y
    const v1 = { x: diffX, y: diffY }
    const v2 = { x: point3.x - point2.x, y: point3.y - point2.y }
    if (point1.x > point2.x && direction === "left") return 0
    if (point1.x < point2.x && direction === "right") return 0
    let angle = calculateAngleBetweenVectors(v1, v2)
    if (angle > 100) angle = 180 - angle
    if (angle < 0) angle = 0
    return angle;
  }
}

/**
 * @description 主动屈髋
 */
export class LegLiftFilter implements AngleUtils {
  direction: "front" | "side" = "side"
  label = "主动屈髋"
  videoSrc = {
    left: videoPre + "/左脚上抬.mp4",
    right: videoPre + "/右脚上抬.mp4",
  }
  compute(data: any, direction: "left" | "right" = "left") {
    if (!data) {
      return 0
    }
    const points = data[0].points
    let projectionA!: points2d
    let projectionB!: points2d
    if (direction === "left") {
      projectionA = points[12]
      projectionB = points[14]
    } else {
      projectionA = points[11]
      projectionB = points[13]
    }
    // 计算投影线段与Y轴的夹角
    let deltaY = projectionB.y - projectionA.y;
    let deltaX = projectionB.x - projectionA.x;
    if (deltaY > 0 && deltaX > 0) return 0
    let angleRadians = Math.atan(deltaX / deltaY);
    let angle = angleRadians * (180 / Math.PI);
    if (angle <= 0) angle = angle
    else if (angle > 40) angle = 180 - angle
    return Math.abs(angle)
  }
}
/**
 * @description 主动单臂屈曲
 */
export class HeadLiftFilter implements AngleUtils {
  direction: "front" | "side" = "side"
  label = "主动单臂屈曲"
  videoSrc = {
    left: videoPre + "/左手屈曲.mp4",
    right: videoPre + "/右手屈曲.mp4"
  }
  compute(data: any, direction: "left" | "right" = "left") {
    if (!data) {
      return 0
    }
    const points = data[0].points
    let projectionA!: points2d
    let projectionB!: points2d
    if (direction === "left") {
      projectionA = points[6]
      projectionB = points[10]
    } else {
      projectionA = points[5]
      projectionB = points[9]
    }
    // 计算投影线段与Y轴的夹角 
    let deltaY = projectionB.y - projectionA.y;
    let deltaX = projectionB.x - projectionA.x;
    let angleRadians = Math.atan(deltaX / deltaY);
    let angle = angleRadians * (180 / Math.PI);
    if (deltaY > 0 && deltaX > 0) return 0
    if (deltaY < 0 && deltaX > 0) { return 180 - angle }
    if (angle <= 0) angle = -angle
    else angle = 180 - angle
    return angle
  }
}

/**
 * @description 主动单臂后伸
 */
export class HeadBackLiftFilter implements AngleUtils {
  direction: "front" | "side" = "side"
  label = "主动单臂后伸"
  videoSrc = {
    left: videoPre + "/左手后伸.mp4",
    right: videoPre + "/右手后伸.mp4",
  }
  compute(data: any, direction: "left" | "right" = "left") {
    if (!data) {
      return 0
    }
    const points = data[0].points
    let projectionA!: points2d
    let projectionB!: points2d
    if (direction === "left") {
      projectionA = points[6]
      projectionB = points[10]
      if (points[18].x < points[12].x) return 0
    } else {
      projectionA = points[5]
      projectionB = points[9]
      if (points[17].x < points[11].x) return 0
    }
    const v1 = { x: projectionA.x - projectionB.x, y: projectionA.y - projectionB.y }
    const v2 = { x: 0, y: 1 }
    let angle = calculateAngleBetweenVectors(v1, v2)
    return 180 - angle
  }
}
/**
 * @description 腰椎前屈后伸
 */
export class LumbarExtensionFilter implements AngleUtils {
  label = "腰椎前屈后伸"
  direction: "front" | "side" = "side"
  videoSrc = {
    left: videoPre + "/弯腰摸脚尖.mp4",
    right: videoPre + "/后仰后仰.mp4",
  }
  private lastValue = 0
  compute(data: any, direction: "left" | "right" = "left") {
    if (!data) {
      if (this.lastValue > 60) {
        return 98
      } else {
        return 0
      }
    }
    const points = data[0].points
    const A = points[12]
    const B = points[11]
    const C = points[6]
    const D = points[5]
    const midStartPoint = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }
    const midEndPoint = { x: (C.x + D.x) / 2, y: (C.y + D.y) / 2 }
    const diffX = midEndPoint.x - midStartPoint.x
    const diffY = midEndPoint.y - midStartPoint.y
    const anglePi = Math.atan(diffX / diffY)
    if (direction === "left") {
      if (midEndPoint.x > midStartPoint.x) return 0
      const angle = Math.abs(Math.round(anglePi * (180 / Math.PI)));
      this.lastValue = angle
      return angle
    } else {
      if (anglePi > 0) return 0
      return -anglePi * (180 / Math.PI);
    }
  }
}

/**
 * @description 腰椎侧屈
 */
export class LumbarRollFilter implements AngleUtils {
  label = "腰椎侧屈"
  direction: "front" | "side" = "front"
  videoSrc = {
    left: videoPre + "/腰椎左侧侧屈.mp4",
    right: videoPre + "/腰椎右侧侧屈.mp4",
  }
  compute(data: any, _direction: "left" | "right" = "left") {
    if (!data) {
      return 0
    }
    const points = data[0].points
    const A = points[12]
    const B = points[11]
    const C = points[6]
    const D = points[5]
    const midStartPoint = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }
    const midEndPoint = { x: (C.x + D.x) / 2, y: (C.y + D.y) / 2 }
    const v1 = { x: midStartPoint.x - midEndPoint.x, y: midStartPoint.y - midEndPoint.y }
    const v2 = { x: 0, y: 1 }
    return Math.abs(calculateAngleBetweenVectors(v1, v2));
  }
}

class SonwAngleFilter {
  direction: "front" | "side" = "front"
  label = "靠墙雪天使"
  videoSrc = {
    left: "http://1312576865.vod-qcloud.com/1600c0eevodcq1312576865/5a06fc311397757900586042892/f0.mp4",
    right: videoPre + "/右手屈曲.mp4"
  }
  compute(data: any, _direction: "left" | "right" = "left") {
    if (!data) {
      return 0
    }
    const points = data[0].points

    let projectionAL = points[6]
    let projectionBL = points[8]

    let projectionAR = points[5]
    let projectionBR = points[7]

    function getComputeAngle(projectionA: points2d, projectionB: points2d) {
      // 计算投影线段与Y轴的夹角 
      let deltaY = projectionB.y - projectionA.y;
      let deltaX = projectionB.x - projectionA.x;
      let angleRadians = Math.atan(deltaX / deltaY);
      let angle = angleRadians * (180 / Math.PI);
      if (deltaY > 0 && deltaX > 0) return 0
      if (deltaY < 0 && deltaX > 0) { return 180 - angle }
      if (angle <= 0) angle = -angle
      else angle = 180 - angle
      return angle
    }
    const res = [getComputeAngle(projectionAL, projectionBL), 180 - getComputeAngle(projectionBR, projectionAR)]
    return res
  }
}