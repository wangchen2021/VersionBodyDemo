import { getUserInfo } from "../../api/apis"
import { getAction } from "../../api/request"
import { lanuage_bind } from "../../language/index"

// components/carryCode/carryCode.ts
Component({
    data: {
        show: false,
        code: "",
        language:<any>null
    },

    lifetimes: {
        attached() {
            lanuage_bind(this)
        }
    },

    methods: {
        showCode(code: string) {
            this.setData({
                show: true,
                code
            })
        },
        inputChange(e: WechatMiniprogram.Input) {
            const value = e.detail.value
            this.setData({
                code: value
            })
        },
        exit() {
            this.setData({
                show: false
            })
            this.triggerEvent("exit")
        },
        submit() {
            getAction("/carryCode/redeem", { code: this.data.code })
                .then(async (res: any) => {
                    await getUserInfo()
                    wx.showToast({
                        icon: "success",
                        title: this.data.language[res.msg],
                        success: () => {
                            setTimeout(() => {
                                this.triggerEvent("finish")
                                this.exit()
                            }, 600)
                        }
                    })
                })
                .catch((err) => {
                    wx.showToast({
                        title: err,
                        icon: "error"
                    })
                })
        }
    }
})