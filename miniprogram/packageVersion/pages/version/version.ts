import { postParamToReport } from "../../../api/apis"
import { MODE } from "../../../api/config"
import { VersionState } from "../../core/app"
import { getFlexSubmitParam, getPlansByValues } from "../../core/plan/estimatePlan"
Page({
  vs: <VersionState | null>null,

  data: {
    videoFilter: false,
    platForm: wx.getSystemInfoSync().platform,
    mode: MODE,
    subtitle:""
  },

  onLoad() {
    const selectPlans = ["9"]
    // const selectPlans = ["8"]
    const app = getApp<IAppOption>()
    const plans = getPlansByValues(selectPlans)
    console.log("detect_plans:", plans);
    app.globalData.selectEstimatePlan = [...plans]
    this.selectComponent("#cacheVideos").setCacheVideos(
      plans.map((item: estimatePlanItem) => {
        return item.videoSrc.one
          ?
          [item.videoSrc.one]
          :
          [item.videoSrc.left, item.videoSrc.right]
      }).flat()
    )
    this.vs = new VersionState()
    this.vs.init(this, plans, "myVideo", "frameCanvas", "angleCanvas")
    this.vs.start()
  },

  videoEnd() {
    if (this.vs) {
      this.vs.onVideoEnd()
    }
  },

  async skipTest() {
    if (MODE === "release") return
    const app = getApp<IAppOption>()
    const flexData = [45, 45, 90, 75, 30, 24, 90, 120, 180, 170, 90, 40]
    app.globalData.flexData = getFlexSubmitParam(flexData, app.globalData.selectEstimatePlan)
    const reportType = Number(wx.getStorageSync("label_type"))
    wx.setStorageSync("flexData", app.globalData.flexData)
    if (reportType === 1) {
      wx.redirectTo({
        url: "/packageQR/pages/questions/questions"
      })
    } else {
      await postParamToReport()
    }
  },

  showVideoFilter() {
    this.setData({
      videoFilter: true
    })
    setTimeout(() => {
      this.setData({
        videoFilter: false
      })
    }, 1000)
  },

  takePhoto() {
    wx.navigateTo({
      url: "/packageVersion/pages/photo/photo"
    })
  },

  onUnload() {
    if (this.vs) {
      this.vs.stop()
    }
  },

  onTimeUpdate(e: WechatMiniprogram.VideoTimeUpdate) {
    // e.detail.currentTime 即为当前播放进度（秒）
    const seconds = Math.floor(e.detail.currentTime)
    this.vs?.setChenVSecond(seconds)
  },

  onShareAppMessage(opts: any): WechatMiniprogram.Page.ICustomShareContent {
    console.log(opts.target)
    return {}
  }
})