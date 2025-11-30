// app.ts
App<IAppOption>({
  globalData: {
    selectEstimatePlan: [],
    flexData: []
  },
  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
      },
    })
  },
  eventBus: {
    updateUserInfo(userInfo: any) {
      wx.setStorageSync("userInfo", userInfo)
    }
  }
  
})