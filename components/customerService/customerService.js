var app = getApp()
const sys = wx.getSystemInfoSync();

// components/customerService/customerService.js
Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    direction: {
      type: String,
      value: 'left'
    },
    DistanceFromBottom: {
      type: String,
      value: '30%'
    },
    type: {
      type: String,
      value: 'normal'
    }

  },


  data: {
    image_src: './kf.png',
    direction: 'left',
    DistanceFromBottom: '30%',
    sv_image_pre: '',
    show_sv_image_pre: false,
    url: "https://usercenter.mp.lighthg.com/api/config/default",
    miniapp_service_text: '',
    cssTypeConfig: app.globalData.cssTypeConfig || { id: 0 },
    miniapp_service_type: 2,//弹出客服类型：1：二维码 2：官方客服 3：粘贴微信号，让用户去加好友 4：跳转客服页面
    
  },
  ready() {
    
    this.getSv_image_pre()
    if (this.data.cssTypeConfig.id == 0) {
      this.setData({
        image_src: './kf.png',
      })
    } else if (this.data.cssTypeConfig.id == 1) {
      this.setData({
        image_src: './kf1.png',
      })
    } else if (this.data.cssTypeConfig.id == 2) {
      this.setData({
        image_src: './kf1.png',
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeBtn() {
      this.setData({
        show_sv_image_pre: false,
      })
    },
    sv_bk_tap() {
      // 改为4选1 方案 目前 只有 3选1  根据 miniapp_service_type 判断 分别展现 弹出二维码 、跳转小程序、跳转网页
      if (this.data.miniapp_service_type == 1) {
        this.setData({
          show_sv_image_pre: true,
        })
      } else if (this.data.miniapp_service_type == 2) {

      } else if (this.data.miniapp_service_type == 3) {

      } else if (this.data.miniapp_service_type == 4) {

      }

    },
    // get imageUrl
    getSv_image_pre() {
      wx.request({
        url: this.data.url,
        method: 'GET',
        data: {
          brand: sys.brand, // 手机品牌 iPhone
          model: sys.model, // 手机型号 iPhone X
          system: sys.system, // 操作系统版本 iOS 10.0.1
          network: getApp().globalData.currentNetwork || "unknown", // 当前网络状态
        },
        success: res => {
          console.log('【获取客服图片】', res)
          this.setData({
            sv_image_pre: res.data.data.miniapp_service_code,
            miniapp_service_text: res.data.data.miniapp_service_text,
            miniapp_service_type: res.data.data.miniapp_service_type,

            miniapp_service_type: 2,
          })
        }
      })
    },
  }
})