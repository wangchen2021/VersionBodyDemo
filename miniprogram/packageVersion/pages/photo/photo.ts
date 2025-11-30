import { getCloundKeyPoints, sumbitPublicFile } from "../../../api/apis"
import { CDN } from "../../../api/config"
import { getCloundKeyPointsAngle } from "../../core/angle/cloundAngleCompute"
import { getPlansByValues } from "../../core/plan/estimatePlan"
Page({

    data: {
        plans: <Array<estimatePlanItem>>[],
        takePhotos: <Array<null | string>>[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        selectIndex: -1,
        finish: false
    },

    onLoad() {
        const selectPlans = ["1", "2", "3", "4", "5", "6", "7", "8"]
        const plans = getPlansByValues(selectPlans)
        this.setData({
            plans
        })
    },

    showBottom(e: WechatMiniprogram.TouchEvent) {
        const { index } = e.currentTarget.dataset
        this.setData({
            selectIndex: index
        })
    },

    hideBottom() {
        this.setData({
            selectIndex: -1
        })
    },

    showCamera() {
        this.selectComponent("#jzCamera").show(this.data.selectIndex, this.data.plans, this.data.takePhotos)
        this.setData({
            selectIndex: -1
        })
    },

    chooseAlbum() {
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album'],
            success: (e: WechatMiniprogram.ChooseMediaSuccessCallbackResult) => {
                const img = e.tempFiles[0].tempFilePath
                const takePhotos = this.data.takePhotos
                takePhotos[this.data.selectIndex] = img
                this.updateTakePhotos(takePhotos)
                this.hideBottom()
            }
        })
    },

    getTakePhotos(e: any) {
        const photos: Array<string | null> = e.detail
        this.updateTakePhotos(photos)
    },

    updateTakePhotos(photos: Array<string | null>) {
        this.setData({
            takePhotos: [...photos]
        })
        this.setData({
            finish: !photos.includes(null)
        })
    },

    async submitPhotos() {
        wx.showLoading({
            title: "上传中",
            icon: "none"
        })
        const resPhotos = []
        for (let item of this.data.takePhotos) {
            let tempPath: any = ""
            if (item?.includes(CDN)) {
                tempPath = item
            } else {
                tempPath = await sumbitPublicFile(item, "userPhotos")
            }
            resPhotos.push(tempPath)
        }
        const res: any = await getCloundKeyPoints(resPhotos)
        const data: any[] = res.data
        const flexData: number[] = []
        for (let item of this.data.plans) {
            const leftKeyPointsData = data.shift()
            flexData.push(getCloundKeyPointsAngle(leftKeyPointsData, item, "left"))
            const rightKeyPointsData = data.shift()
            flexData.push(getCloundKeyPointsAngle(rightKeyPointsData, item, "right"))
        }
        console.log(flexData);
        if (flexData.includes(-1)) {
            const takePhotos = this.data.takePhotos
            for (let i in flexData) {
                if (flexData[i] == -1) {
                    takePhotos[i] = null
                }
            }
            this.updateTakePhotos(takePhotos)
            wx.hideLoading()
            wx.showToast({
                title: "照片不合规请重新上传",
                icon: "none"
            })
        } else {
            const app = getApp<IAppOption>()
            app.globalData.flexData = flexData
            wx.navigateTo({
                url: "/packageQR/pages/questions/questions",
                complete: () => {
                    wx.hideLoading()
                }
            })
        }
    },

    warnSubmit() {
        wx.showToast({
            title: "请上传全部图片",
            icon: "none"
        })
    },

    nothing() { }
})