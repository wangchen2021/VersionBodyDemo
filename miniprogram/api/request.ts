import requestConfig from "./config"

export type requestConfig = {
    showLoading?: WechatMiniprogram.ShowLoadingOption,
    showToast?: boolean,
    removeBaseUrl?: boolean,
} & Omit<WechatMiniprogram.RequestOption, 'url'>

console.info("current config：", requestConfig);

export function getAction(url: string, data?: any, config?: requestConfig) {
    return httpAction(url, "GET", data, config)
}

export function postAction(url: string, data?: any, config?: requestConfig) {
    return httpAction(url, "POST", data, config)
}

export function putAction(url: string, data?: any, config?: requestConfig) {
    return httpAction(url, "PUT", data, config)
}

export function deleteAction(url: string, data?: any, config?: requestConfig) {
    return httpAction(url, "DELETE", data, config)
}

export function httpAction(url: string, method: "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT", data?: any, config?: requestConfig): Promise<httpResponse> {
    const token = wx.getStorageSync("jizhi_token")
    return new Promise((reslove, reject) => {
        if (config&&config.showLoading) {
            wx.showLoading({
                title: "",
            })
        }
        wx.request({
            url: config?.removeBaseUrl ? url : requestConfig.baseUrl + url,
            data,
            method,
            ...config,
            header: {
                ...config?.header,
                Authorization: token
            },
            success: (res) => {
                const data = res.data as httpResponse
                if (data.success) {
                    reslove(data)
                }
                else {
                    console.error("request_url:" + url);
                    console.error(data);
                    if (config?.showToast) {
                        wx.showToast({
                            title: data.msg,
                            icon: "error"
                        })
                    }
                    reject(data.msg)
                }
            },
            fail: (err) => {
                console.error(err);
                
                if (config?.showToast) {
                    wx.showToast({
                        title: err.errMsg,
                        icon: "error"
                    })
                }
                reject(err)
            },
            complete: () => {
                if (config&&config.showLoading) {
                    wx.hideLoading()
                }
            }
        })
    })
}

export function simpleRequest(url: string, method: "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT", data?: any, config?: WechatMiniprogram.RequestOption) {
    return new Promise((reslove, reject) => {
        wx.request({
            url,
            data,
            method,
            ...config,
            success: (res) => {
                reslove(res)
            },
            fail: (err) => {
                console.error(err);
                reject(err)
            },
        })
    })
}