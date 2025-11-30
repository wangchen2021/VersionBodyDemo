// packageVersion/components/jzCamera/jzCamera.ts
Component({

    data: {
        show: false,
        navTop: 60,
        selectIndex: 0,
        plans: <Array<estimatePlanItem>>[],
        takePhotos: <Array<string | null>>[],
        name: "",
        coverImg: "",
        currentItem: ""
    },

    lifetimes: {
        attached() {
            this.setData({
                navTop: wx.getMenuButtonBoundingClientRect().top + 5,
                cameraCtx: wx.createCameraContext()
            })
        }
    },

    methods: {
        show(selectIndex: number, plans: Array<estimatePlanItem>, takePhotos: Array<string | null>) {
            console.log(takePhotos);
            this.setData({
                show: true,
                plans,
                selectIndex,
                takePhotos: [...takePhotos],
                currentItem: `item${selectIndex}`
            })
            this.getShowData(selectIndex)
        },

        hide() {
            this.setData({
                show: false
            })
        },

        setIndex(e: WechatMiniprogram.TouchEvent) {
            const selectIndex = e.currentTarget.dataset.index
            this.setData({
                selectIndex,
            })
            this.getShowData(selectIndex)
        },

        getShowData(index: number) {
            const val = index % 2
            const plans = this.data.plans
            if (val === 0) {
                this.setData({
                    name: plans[index / 2].photoName.left,
                    coverImg: plans[index / 2].coverImg.left,
                })
            } else {
                this.setData({
                    name: plans[(index - 1) / 2].photoName.right,
                    coverImg: plans[(index - 1) / 2].coverImg.right,
                })
            }
        },

        getPhotos() {
            const ctx: WechatMiniprogram.CameraContext = this.data.cameraCtx
            ctx.takePhoto({
                success: (e: WechatMiniprogram.TakePhotoSuccessCallbackResult) => {
                    const photo = e.tempImagePath
                    const takePhotos = this.data.takePhotos
                    takePhotos[this.data.selectIndex] = photo
                    this.updateTakePhotos(takePhotos)
                    wx.showToast({
                        icon: "none",
                        title: "采集成功"
                    })
                    wx.vibrateShort({
                        type: "heavy"
                    })
                }
            })
        },

        updateTakePhotos(photos: Array<string | null>) {
            this.setData({
                takePhotos: [...photos]
            })
            this.triggerEvent("update", this.data.takePhotos)
        }
    }
})