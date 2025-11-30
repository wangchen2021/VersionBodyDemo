// components/navBack/navBack.ts
Component({
    properties: {
        stopDefault: {
            type: Boolean
        }
    },
    data: {
        navTop: 40
    },
    lifetimes: {
        attached() {
            this.setData({
                navTop: wx.getMenuButtonBoundingClientRect().top
            })
        }
    },
    methods: {
        navgationBack() {
            if (this.properties.stopDefault) return
            wx.navigateBack({
                delta: 1,
                fail: () => {
                    wx.reLaunch({
                        url: "/pages/index/index"
                    })
                }
            })
        }
    }
})