import { getUserInfo } from "../../api/apis"
import { postAction } from "../../api/request"

Component({

  data: {
    show: false,
    name: "",
    phone: "",
    city: "",
    cityArr: [],
    address: "",
    userInfo: <any>null,
    edit: true,
    state: -1,
    showConfirm: false,
    select: false,
    giftType: "",
    giftIndex: <any>-1,
    giftOptions: ["护腰礼盒", "坐享礼盒"]
  },

  methods: {
    show() {
      const userInfo = wx.getStorageSync("userInfo")
      this.setData({
        show: true,
        userInfo,
      })
      if (userInfo.permissions.includes(8)) {
        console.log("可选类型");
        this.setData({
          select: true
        })
      }
      if (userInfo.address) {
        this.setData({
          edit: false,
          address: userInfo.address.address,
          city: userInfo.address.city,
          name: userInfo.address.name,
          phone: userInfo.address.phone,
        })
        if(this.data.select){
          this.setData({
            giftType:userInfo.address.giftType
          })
        }
        if (userInfo.send == 1) {
          this.setData({
            state: 1
          })
        } else if (userInfo.send == 0) {
          this.setData({
            state: 0
          })
        }
      }
    },
    exit() {
      this.setData({
        show: false
      })
      this.triggerEvent("exit")
    },
    inputHandle(e: WechatMiniprogram.Input) {
      const { param } = e.currentTarget.dataset
      this.setData({
        [param]: e.detail.value
      })
    },

    bindRegionChange(e: WechatMiniprogram.PickerChange) {
      const value = e.detail.value as any
      const cityStr = value.join("-")
      this.setData({
        city: cityStr,
        cityArr: value
      })
    },

    hideState() {
      this.setData({
        state: -1
      })
    },

    copySendId(e: WechatMiniprogram.TouchEvent) {
      const { data } = e.currentTarget.dataset
      wx.setClipboardData({
        data,
        success: () => {
          wx.showToast({
            title: '复制成功',
            icon: "none"
          })
        }
      })
    },

    submit() {
      const { name, phone, city, address } = this.data
      const param: { [key: string]: string } = {
        name,
        phone,
        city,
        address
      }
      if (this.data.select) {
        Object.assign(param, { giftType: this.data.giftType })
      }
      for (let key in param) {
        if (param[key].length === 0) {
          wx.showToast({
            title: "请填写完整信息",
            icon: "none"
          })
          return
        }
      }
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(param.phone)) {
        wx.showToast({
          title: "请填写正确手机号码",
          icon: "none"
        })
        return
      }
      this.showConfirm()
    },

    showConfirm() {
      this.setData({
        showConfirm: true
      })
    },

    confrimSubmit() {
      const { name, phone, city, address } = this.data
      const param: { [key: string]: string } = {
        name,
        phone,
        city,
        address
      }
      if (this.data.select) {
        Object.assign(param, { giftType: this.data.giftType })
      }
      console.log(param);
      wx.requestSubscribeMessage({
        tmplIds: ['tAgDvRSz3zD1Hx5xfYjUs_Gwwv3nJ8yc7VywAUIPNME'],
        success: () => {
          console.log('用户订阅成功')
        },
        fail: () => {
          console.log("用户拒绝订阅");
        },
        complete: async () => {
          await postAction("/user/postAddress", param, { showToast: true })
          await getUserInfo()
          this.hideConfirm()
          this.show()
        }
      })
    },

    hideConfirm() {
      this.setData({
        showConfirm: false
      })
    },

    bindGiftChange(e: WechatMiniprogram.PickerChange) {
      const index = e.detail.value
      const value = this.data.giftOptions[Number(index)]
      console.log(index, value);
      this.setData({
        giftIndex: index,
        giftType: value
      })
    }
  }
})