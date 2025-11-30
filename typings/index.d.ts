/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    selectEstimatePlan: estimatePlanItem[],
    flexData: any[],
    language?:any
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  eventBus: AnyObject
}