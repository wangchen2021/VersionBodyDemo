import { languageList } from "./config"

/**
 * @description 国际化字符控制器
 */
export class Language {
    private languageType: "CN" | "EN" = "CN"
    initLanguageType() {
        const languageType = wx.getStorageSync("languageType")
        if (languageType) this.languageType = languageType
        else {
            const info = wx.getSystemInfoSync()
            if (info.language === "zh_CN") {
                this.languageType = "CN"
            } else {
                this.languageType = "EN"
            }
            //无oly适配 默认全部中文
            this.languageType = "CN"
            wx.setStorageSync("languageType", this.languageType)
        }
    }

    getLanguageType() {
        return this.languageType
    }

    setLanguageType(type: "CN" | "EN") {
        this.languageType = type
        wx.setStorageSync("languageType", this.languageType)
    }

    getSuitLanguageList(listNames: string[]) {
        const languageType = this.languageType
        let res: { [key: string]: any } = {}
        for (let item of listNames) {
            const targetPageLanguageList = languageList[item]
            if (languageList[item]) {
                for (let key in targetPageLanguageList) {
                    const value = targetPageLanguageList[key]
                    res[key] = value[languageType]
                }
            }
        }
        return res
    }

    bindPage(page: any, pageNames: string[]) {
        page.setData({
            language: this.getSuitLanguageList(pageNames)
        })
    }
}

/**
 * @description 在页面中调用该函数绑定国际化 lanuage_bind(this)
 * @param page page或者component实例
 * @param listName page名/component名  对应相应字符集
 */
export function lanuage_bind(page: any, listName?: string | string[]) {
    const listNames: any[] = ["common"]
    const targetName = page.route ? page.route : page.is
    const pageNameArr = targetName.split("/")
    const pathName: string = pageNameArr[pageNameArr.length - 1]
    listNames.push(pathName)
    if (listName) {
        if (Array.isArray(listName)) {
            listNames.push(...listName)
        } else {
            listNames.push(listName)
        }
    }
    const app = getApp<IAppOption>()
    let language = app.globalData.language
    if (!language) {
        language = new Language()
        language.initLanguageType()
        app.globalData.language = language
    }
    language.bindPage(page, listNames)
}
