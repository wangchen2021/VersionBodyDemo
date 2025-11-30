import { calculateAngleBetweenVectors } from "../angle/mathTools";
import { CvOptionsEmitFlag } from "./index";
import { playaudio } from "./opsTools";

const checkOpenLegs = (_angle: any, points: points2d[], currentSeconds: number) => {
  //10s开始检测
  if (currentSeconds < 10) {
    return CvOptionsEmitFlag.NOT_EMIT
  }
  //15s后停止检测,删除该操作
  if (currentSeconds > 18) {
    return CvOptionsEmitFlag.DELETE
  }
  const len1 = Math.abs(points[11].x - points[12].x)
  const len2 = Math.abs(points[13].x - points[14].x)
  if (len1 * 1.1 > len2) {
    return CvOptionsEmitFlag.EMIT
  }
  return CvOptionsEmitFlag.NOT_EMIT
}

const checkVerticalBody = (_angle: any, points: points2d[], currentSeconds: number) => {
  //10s开始检测直到最后
  if (currentSeconds < 10) {
    return CvOptionsEmitFlag.NOT_EMIT
  }
  let topPoint = points[0]
  let bottomPoint = { x: (points[12].x + points[11].x) / 2, y: (points[12].y + points[11].y) / 2 }
  const vector = { x: bottomPoint.x - topPoint.x, y: bottomPoint.y - topPoint.y }
  const angle = calculateAngleBetweenVectors(vector, { x: 0, y: 1 })
  return angle > 20 ? CvOptionsEmitFlag.EMIT : CvOptionsEmitFlag.NOT_EMIT
}

const checkHorizontalShoulder = (_angle: any, points: points2d[]) => {

}

const checkArms = (_angle: any, points: points2d[]) => {

}

const doGodJob = (_angle: any, points: points2d[]) => {
  return true
}

const KeepGoing = (_angle: any, points: points2d[]) => {
  return true
}

export const snowAngel: Record<string, CvOption> = {
  checkOpenLegs: {
    emit: checkOpenLegs,
    once: false,
    data: "双脚打开",
    options: function (fn?: Function) {
      return playaudio(snowAngel.checkOpenLegs, "https://vcos.changan-health.com/thi/webapp/20251130/2.mp3", fn)
    }
  },

  checkVerticalBody: {
    emit: checkVerticalBody,
    once: false,
    data: "上身保持挺直",
    options: function (fn?: Function) {
      return playaudio(snowAngel.checkVerticalBody, "https://vcos.changan-health.com/thi/webapp/20251130/3.mp3", fn)
    }
  },

  checkHorizontalShoulder: {
    emit: checkHorizontalShoulder,
    once: true,
    data: "肩膀保持平直",
    options: () => {

    }
  },

  checkArms: {
    emit: checkArms,
    once: false,
    data: "尽量抬高双臂，指尖在耳朵上方",
    options: () => {

    }
  },

  doGodJob: {
    emit: doGodJob,
    once: false,
    data: "做的很棒",
    options: () => {

    }
  },

  KeepGoing: {
    emit: KeepGoing,
    once: false,
    data: "继续加油",
    options: () => {

    }
  },
}

