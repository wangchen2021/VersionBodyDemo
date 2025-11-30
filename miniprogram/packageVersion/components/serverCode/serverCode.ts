// packageVersion/components/serverCode/serverCode.ts
import { serverCode } from "../../../api/config"
Component({

    data: {
        navTop: 0,
        show: false,
        qCode: serverCode.bug
    },
    lifetimes: {
        attached() {
            const info = wx.getMenuButtonBoundingClientRect()
            this.setData({
                navTop: info.top,
            })
        }
    },
    methods: {
        showModal() {
            console.log('show_modal');
            this.setData({
                show: true
            })
        },
        goIndex() {
            wx.reLaunch({
                url: "/pages/index/index"
            })
        },
        close() {
            this.setData({
                show: false
            })
        }
    }
})