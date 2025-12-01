import { calculateAngleBetweenVectors } from "../angle/mathTools";
import { CvOptionsEmitFlag } from "./index";
import { judgeTimeInterval, playaudio } from "./opsTools";

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

const checkHorizontalShoulder = (_angle: any, points: points2d[], currentSeconds: number) => {
  //10s开始检测直到最后
  if (currentSeconds < 10) {
    return CvOptionsEmitFlag.NOT_EMIT
  }
  const vector = { x: points[5].x - points[6].x, y: points[5].y - points[6].y }
  const angle = calculateAngleBetweenVectors(vector, { x: 1, y: 0 })
  return angle > 10 ? CvOptionsEmitFlag.EMIT : CvOptionsEmitFlag.NOT_EMIT
}

const checkArms = (_angle: any, points: points2d[], _currentSeconds: number) => {
  const vector1 = { x: points[4].x - points[18].x, y: points[4].y - points[18].y }
  const vector2 = { x: points[3].x - points[17].x, y: points[3].y - points[17].y }
  const referY = { x: 0, y: 1 }
  const vectorAngle1 = calculateAngleBetweenVectors(vector1, referY)
  const vectorAngle2 = calculateAngleBetweenVectors(vector2, referY)
  const timeSlots: Array<number | string>[] = [
    ["20", "4:00"],
  ]
  if (vectorAngle1 > 60 && vectorAngle2 > 60 && judgeTimeInterval(timeSlots, _currentSeconds)) {
    return CvOptionsEmitFlag.EMIT
  }
  return CvOptionsEmitFlag.NOT_EMIT
}

const doGodJob = (_angle: any, _points: points2d[], _currentSeconds: number) => {
  //30s后开始
  if (_currentSeconds < 30) {
    return CvOptionsEmitFlag.NOT_EMIT
  }
  return CvOptionsEmitFlag.EMIT
}

const KeepGoing = (_angle: any, _points: points2d[], currentSeconds: number) => {
  const timeSlots: Array<number | string>[] = [
    ["1:31", "1:40"],
    ["3:05", "3:15"],
  ]
  if (judgeTimeInterval(timeSlots, currentSeconds)) {
    return CvOptionsEmitFlag.EMIT
  }
  return CvOptionsEmitFlag.NOT_EMIT
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
    once: false,
    data: "肩膀保持平直",
    options: function (fn?: Function) {
      return playaudio(snowAngel.checkHorizontalShoulder, "https://vcos.changan-health.com/thi/webapp/20251130/4.mp3", fn)
    }
  },

  checkArms: {
    emit: checkArms,
    once: false,
    data: "尽量抬高双臂，指尖在耳朵上方",
    options: function (fn?: Function) {
      return playaudio(snowAngel.checkArms, "https://vcos.changan-health.com/thi/webapp/20251130/5.mp3", fn)
    }
  },

  doGodJob: {
    emit: doGodJob,
    once: false,
    data: "做的很棒",
    options: function (fn?: Function) {
      return playaudio(snowAngel.doGodJob, "https://vcos.changan-health.com/thi/webapp/20251130/6.mp3", fn)
    },
    interval: 30
  },

  KeepGoing: {
    emit: KeepGoing,
    once: false,
    data: "继续加油",
    options: function (fn?: Function) {
      return playaudio(snowAngel.KeepGoing, "https://vcos.changan-health.com/thi/webapp/20251130/7.mp3", fn)
    },
    interval: 15
  },
}

