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

export {
  playaudio
}