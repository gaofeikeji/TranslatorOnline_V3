// components/gift_use/gift_use.js

const baseUrl = "https://usercenter.mp.lighthg.com";
const sys = wx.getSystemInfoSync();

Component({
  options: {
    multipleSlots: true,
  },
  properties: {

  },
  lifetimes: {
    attached() {
      this.inputAutoHeight();
      
    },
    // 在组件实例被从页面节点树移除时执行
    detached() {
      // this.init();
    },
  },

  data: {
    showGift: false,
    dhmCode: '',
    safeHeight: 0,
    keyboardHeight: 0,

    cursor_spacing: 0,//输入框距离底部的距离
  },

  methods: {
    //获取安全区高度 然后监听键盘高度 用于自动调整输入框高度 data:safeHeight keyboardHeight
    // 需要wxml中 进行绑定 计算方式 要根据具体情况进行调整
    inputAutoHeight() {
      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          console.log("当前屏幕的信息是", res);
          const safeHeight = res.screenHeight - res.safeArea.bottom;
          // cursor_spacing 等于 85 乘以 rpx 转 px 的比例
          let cursor_spacing = 178 * (res.screenWidth / 750);
          that.setData({
            safeHeight: safeHeight,
            cursor_spacing: cursor_spacing,
          });
          console.log("安全区safeHeight", safeHeight);
        },
      });
      wx.onKeyboardHeightChange((res) => {
        console.log("键盘高度", res);
        that.setData({
          keyboardHeight: res.height,
        });
      });
    },
    showDhm() {
      this.setData({
        showGift: true,
      })
    },
    closeBtn() {
      this.setData({
        showGift: false,
      })
    },
    inputDhm(e) {
      this.setData({
        dhmCode: e.detail.value,
      })
    },
    // {{host}}/api/subscribe/gift_use
    // 提交兑换码 "code": "大吉大利今晚吃鸡" //兑换码 post 
    giftUse() {
      wx.request({
        url: baseUrl + "/api/subscribe/gift_use",
        method: "POST",
        data: {
          code: this.data.dhmCode,
        },
        header: {
          Authorization: "Bearer " + getApp().globalData.access_token,
          "x-device-brand": sys.brand || "unknown",
          "x-device-path": getCurrentPages()[getCurrentPages().length - 1].route,
          "x-device-model": sys.model || "unknown",
          "x-device-system": sys.system || "unknown",
          "x-device-network": getApp().globalData.currentNetwork || "unknown",
        },
        success: (res) => {
          console.log("【用户中心】", res);
          if (res.data.code == 1) {
            // 发送 getGift 事件 
            this.triggerEvent('getGift', { name: 'getGift' });
            wx.showModal({
              content: '恭喜您兑换成功了！',
              confirmText: '我知道了',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  this.setData({
                    showGift: false,
                  })

                }
              }
            })
            this.setData({
              showGift: false,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
            })
          }
        },
      });
    },
  }
})