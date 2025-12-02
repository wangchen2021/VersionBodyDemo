const playaudio = (opions: CvOption, src: string, fn?: Function) => {
  return new Promise((resolve, reject) => {
    if (fn) {
      fn(opions)
    }
    const audio = wx.createInnerAudioContext()
    audio.src = src
    audio.play()
    audio.onEnded(() => {
      resolve(opions)
    })
    audio.onError((err) => {
      console.log("音频播放失败", err);
      reject(err)
    })
  })
}

const judgeTimeInterval = (timeSlots: Array<number|string>[], targetTime: number | string) => {
  let seconds = formatTimeToSeconds(targetTime)
  for (let timeSlot of timeSlots) {
    const startTime = formatTimeToSeconds(timeSlot[0])
    const endTime = formatTimeToSeconds(timeSlot[1])
    if (startTime <= seconds && endTime >= seconds) {
      return true
    }
  }
  return false
}

const formatTimeToSeconds = (targetTime: number | string) => {
  let seconds = 0
  if (typeof targetTime === "string") {
    //解析秒数
    const timeArray = targetTime.split(":")
    let unit = 0
    for (let i = timeArray.length - 1; i >= 0; i--) {
      seconds += Number(timeArray[i]) * Math.pow(60, unit)
      unit++
    }
  } else {
    seconds = targetTime
  }
  return seconds
}

export {
  playaudio,
  judgeTimeInterval,
  formatTimeToSeconds,
}