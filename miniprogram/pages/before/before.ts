Page({
  data: {
    // 属性列表
    basicAttributes: ["气血最大值", "最大外功", "最小外功", "外功防御"],
    fiveDAttributes: ["体", "劲", "御", "敏", "势"],
    judgeAttributes: ["精准率", "会心率", "会意率"],
    attackAttributes: [
      "最大鸣金攻击", "最小鸣金攻击",
      "最大裂石攻击", "最小裂石攻击",
      "最大牵丝攻击", "最小牵丝攻击",
      "最大破竹攻击", "最小破竹攻击"
    ],
    specialAttributes: [
      "单体奇术增伤", "群体奇术增伤", "玩家增伤", "首领增伤", "对应武学增伤", "全武学增伤"
    ],

    // 选中的属性
    selectedItems: [] as string[],
    result: <any>null,
    scrollId:"",
  },

  // 选择属性
  selectItem(e: any) {
    const value = e.currentTarget.dataset.value;
    let selectedItems = this.data.selectedItems;
    selectedItems.push(value);
    this.setData({
      selectedItems: selectedItems
    });
    wx.showToast({
      title: value,
      icon: "none",
    })
    wx.vibrateShort({
      type:"medium"
    })
    this.getResult()
    setTimeout(()=>{
      this.setData({
        scrollId:"#line"
      })
    })
  },

  // 移除单个属性
  removeItem(e: any) {
    const index = e.currentTarget.dataset.index;
    let selectedItems = this.data.selectedItems;
    selectedItems.splice(index, 1);

    this.setData({
      selectedItems: selectedItems
    });

    this.getResult()
  },

  // 清空所有
  clearAll() {
    this.setData({
      selectedItems: [],
      result:null
    });
  },

  getResult() {
    if (this.data.selectedItems.length < 10) {
      return
    }
    console.log("预测");
    wx.request({
      url: 'http://api.dev.duguqinchen.com/predict',
      method: 'POST',
      data: {
        current_type: '鸣金影',
        sequence: this.data.selectedItems
      },
      success: (res) => {
        console.log('预测结果:', res.data);
        this.setData({
          result: res.data
        })
      },
      fail: (err) => {
        console.error(err);
      },
    })
  }
});