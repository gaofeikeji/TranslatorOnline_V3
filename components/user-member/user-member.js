var app = getApp();

const baseUrl = "https://usercenter.mp.lighthg.com";
const sys = wx.getSystemInfoSync();

Component({
  properties: {
    subscribe: {
      type: Object,
      value: {}
    },
  },
  data: {
    actions: {},
    // subscribe:'',
  },
  lifetimes: {
    attached() {
      if (app.globalData.access_token) {
        this.getActions();
        // this.getSubscribe();
      } else {
        app.access_tokenCallback = () => {
          this.getActions();
          // this.getSubscribe();
        }
      }
    },
    // 在组件实例被从页面节点树移除时执行
    detached() {
      // this.init();
    },
  },
  methods: {
    openVip: function () {
      // 发送事件
      this.triggerEvent('openVip', { name: 'openVip' });
    },
    // getSubscribe(){
    //   wx.login({
    //     success: (res) => {
    //       wx.request({
    //         url: baseUrl + "/api/user/login",
    //         method: "POST",
    //         data: {
    //           code: res.code,
    //         },
    //         header: {
    //           Authorization: app.globalData.access_token,
    //           "x-device-brand": sys.brand || "unknown",
    //           "x-device-path": getCurrentPages()[getCurrentPages().length - 1].route,
    //           "x-device-model": sys.model || "unknown",
    //           "x-device-system": sys.system || "unknown",
    //           "x-device-network": getApp().globalData.currentNetwork || "unknown",
    //         },
    //         success: (res) => {
    //           console.log("【用户中心-会员信息】", res);
    //           this.setData({
    //             subscribe: res.data.data.subscribe,
    //           });
    //         },
    //       });
    //     },
    //   })
    // },
    getActions() {
      wx.request({
        url: baseUrl + "/api/user/actions",
        method: "GET",
        header: {
          Authorization: app.globalData.access_token,
          "x-device-brand": sys.brand || "unknown",
          "x-device-path": getCurrentPages()[getCurrentPages().length - 1].route,
          "x-device-model": sys.model || "unknown",
          "x-device-system": sys.system || "unknown",
          "x-device-network": getApp().globalData.currentNetwork || "unknown",
        },
        success: (res) => {
          console.log("【用户中心-会员动作】", res);
          this.setData({
            actions: res.data.data,
          });
          // // test
          // this.setData({
          //   actions: {
          //     payment_status: true
          //   }
          // })
        },
      });
    },
  },
});
