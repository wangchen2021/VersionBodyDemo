import { lanuage_bind } from "../../language/index"

Component({
    data: {
        scores: [
            {
                value: 0,
                label: "无痛"
            },
            {
                value: 2,
                label: "有一点痛"
            },
            {
                value: 4,
                label: "疼痛"
            },
            {
                value: 6,
                label: "很痛"
            },
            {
                value: 8,
                label: "非常痛"
            },
            {
                value: 10,
                label: "痛到极致"
            },
        ],
        slider: <any>{},
        value: 0
    },
    lifetimes: {
        attached() {
            lanuage_bind(this)
            const query = wx.createSelectorQuery().in(this)
            query.select('#slider').boundingClientRect((res) => {
                res.top // 这个组件内 #the-id 节点的上边界坐标
                this.data.slider = res
            }).exec()
        }
    },
    methods: {
        move(e: WechatMiniprogram.TouchEvent) {
            const curX = e.changedTouches[0].pageX
            const { left, right } = this.data.slider
            let value = (curX - left) / (right - left)
            if (value > 1) {
                value = 1
            } else if (value < 0) {
                value = 0
            }
            value = Math.round(value * 10)
            if (value != this.data.value) {
                this.setData({
                    value
                })
                wx.vibrateShort({
                    type: "light"
                })
                this.triggerEvent("change", value)
            }
        }
    }
})