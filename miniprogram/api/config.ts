const AccountInfo = wx.getAccountInfoSync().miniProgram
export const MODE = "release"
const localDevUrls={
    devLocal:"http://127.0.0.1:39030/api",
    proLocal:"http://127.0.0.1:39400/api"
}
const baseUrls = {
    develop: "https://jizhi.painspective.com/api",
    trial: "https://jizhi.painspective.com/api",
    release: "https://api.painspective.com/api"
}
// export const MODE="release"
// baseUrls.develop = localDevUrls.devLocal
baseUrls.develop=baseUrls.release
const baseUrl = MODE === "release" ? baseUrls.release : baseUrls[MODE]
export const CDN = "https://cos.painspective.com/jizhi/miniProgram"
export const COS = "https://jizhi-health-1325300580.cos.ap-shanghai.myqcloud.com/jizhi/miniProgram"
export const qCode = {
    develop: CDN + "/public/devQcode.jpg",
    trial: CDN + "/public/devQcode.jpg",
    release: CDN + "/public/qcodePro.jpg"
}[MODE]
export const serverCode = {
    bug: "https://cos.painspective.com/jizhi/miniProgram/public/bugCode.png",
    serve: "https://cos.painspective.com/jizhi/miniProgram/public/serverCode.png",
}
const systemInfo = wx.getSystemInfoSync()
export default {
    AccountInfo,
    MODE,
    baseUrls,
    baseUrl,
    CDN,
    qCode,
    systemInfo,
    serverCode,
    localDevUrls
}