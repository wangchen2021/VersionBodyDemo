import { calculateAngleBetweenVectors } from "../angle/mathTools";
import { CvOptionsEmitFlag } from "./index";
import { formatTimeToSeconds, judgeTimeInterval, playaudio } from "./opsTools";

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

function getPutHeadsUpTimeSlotsSeconds() {
  const putHeadsUpTimeSlots = [
    ["19", "20"],
    ["26", "27"],
    ["34", "35"],
    ["42", "43"],
    ["49", "50"],
    ["56", "57"],
    ["1:04", "1:05"],
    ["1:11", "1:12"],
    ["1:19", "1:20"],
    ["1:26", "1:27"],
    ["1:52", "1:53"],
    ["1:59", "2:01"],
    ["2:07", "2:08"],
    ["2:14", "2:15"],
    ["2:22", "2:23"],
    ["2:29", "2:30"],
    ["2:37", "2:38"],
    ["2:44", "2:45"],
    ["2:52", "2:53"],
    ["2:59", "3:00"],
    ["3:25", "3:26"],
    ["3:32", "3:33"],
    ["3:40", "3:41"],
    ["3:47", "3:48"],
    ["3:55", "3:56"],
    ["4:02", "4:03"],
    ["4:10", "4:11"],
    ["4:17", "4:18"],
    ["4:25", "4:26"],
    ["4:32", "4:33"],
  ]
  let res = new Map()
  for (let slot of putHeadsUpTimeSlots) {
    const start = formatTimeToSeconds(slot[0])
    const end = formatTimeToSeconds(slot[1])
    for (let i = start; i <= end; i++) {
      res.set(i, true)
    }
  }
  return res
}

const putHeadsUpSecondsMap = getPutHeadsUpTimeSlotsSeconds()


const checkArms = (_angle: any, points: points2d[], _currentSeconds: number) => {
  const vector1 = { x: points[4].x - points[18].x, y: points[4].y - points[18].y }
  const vector2 = { x: points[3].x - points[17].x, y: points[3].y - points[17].y }
  const referY = { x: 0, y: 1 }
  const vectorAngle1 = calculateAngleBetweenVectors(vector1, referY)
  const vectorAngle2 = calculateAngleBetweenVectors(vector2, referY)
  if (vectorAngle1 > 70 && vectorAngle2 > 70 && putHeadsUpSecondsMap.has(_currentSeconds)) {
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
    interval: 35
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

