import { getSuffix } from "../utils/StringUtil"
import { deleteAction, getAction, postAction, simpleRequest } from "./request"
import { CDN, COS, MODE } from "./config"
export function login() {
  return new Promise((resolve, reject) => {
    // 登录
    wx.login({
      success: async (res) => {
        const code = res.code
        const response = await getAction("/user/login", { code })
        wx.setStorageSync("jizhi_token", response.data)
        resolve(response.data)
      },
      fail: (err) => {
        console.error(err);
        wx.showToast({
          title: "登录异常" + err.errMsg,
          icon: "none"
        })
        reject(err)
      }
    })
  })
}

export async function getUserInfo() {
  const app = getApp<IAppOption>()
  const res: httpResponse = await getAction("/user/getUserInfo")
  wx.setStorageSync("userInfo", res.data)
  app.eventBus.updateUserInfo(res.data)
  return res.data
}

export async function signUp(param: any) {
  const app = getApp<IAppOption>()
  const avatar = param.avatar
  const newAvatar = await sumbitPublicFile(avatar, "avatar")
  const systemInfo = wx.getSystemInfoSync()
  const device = `${systemInfo.system}(${systemInfo.version})`
  const submitParam = { ...param, avatar: newAvatar, device }
  const res: httpResponse = await postAction("/user/signUp", submitParam, { showToast: true })
  wx.setStorageSync("userInfo", res.data)
  app.eventBus.updateUserInfo(res.data)
}

export async function sumbitPublicFile(file: any, folderName?: string) {
  if (!file) return null
  const wxfs = wx.getFileSystemManager();
  const type = '.' + getSuffix(file)
  let tempData = wxfs.readFileSync(file);
  const preUrlData = await getAction("/file/getPublicPreUrl", { type, folderName: folderName ? folderName : "" })
  const preUrl: string = preUrlData.data
  simpleRequest(preUrl, "PUT", tempData)
  const cosAddress = preUrl.split("?")[0]
  const newAddress = cosAddress.replace(COS, CDN)
  return newAddress
}

export async function getCloundKeyPoints(photos: string[]) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: "https://api.painspective.com/version/detect",
      data: photos,
      method: "POST",
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export function deleteSysUser() {
  if (MODE === 'release') return
  return deleteAction("/user/delete")
    .then(() => {
      wx.removeStorageSync("userInfo")
      wx.showToast({
        icon: "none",
        title: "本用户删除成功"
      })
    })
}

export async function postParamToReport() {
  const label = {
    type: wx.getStorageSync("label_type"),
    ...wx.getStorageSync("label_param")
  }
  const selectBodyParts = wx.getStorageSync("selectBodyParts")
  const flexData = wx.getStorageSync("flexData")
  let answers = wx.getStorageSync("answers")
  if (answers === "") answers = null
  const param = {
    label,
    selectBodyParts,
    flexData,
    answers,
  }
  await postAction("/report/postReportParams", param, { showToast: true })
  await getUserInfo()
  setTimeout(() => {
    console.log(param);
    wx.reLaunch({
      url: "/packageQR/pages/report/report?loading=true"
    })
    const storeKeys = ["progress", "label_type", "label_param", "flexData", "answers", "selectBodyParts"]
    for (let key of storeKeys) {
      wx.removeStorageSync(key)
    }
  }, 1000)
}

export async function getPtoCRightToken() {
  const res = await getAction("/report/getPtoCRightToken")
  return res
}