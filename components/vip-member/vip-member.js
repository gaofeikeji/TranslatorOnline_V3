const baseUrl = "https://usercenter.mp.lighthg.com";

// const baseUrl = "https://usercenter.test.meitry.com"
const sys = wx.getSystemInfoSync();
var timer = null;

Component({
  properties: {
    // showVipView: {
    //   type: Boolean,
    //   value: false,
    // },
  },
  observers: {
  },
  data: {
    showVipView: false,
    // 显示价格包窗口
    showWrapper: true,
    // 显示优惠券窗口
    showCoupon: false,

    couponBgImage:
      "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/oFvzAVRxonxj1TznTRAa72n5Q2twxhGXbgVd0GGn.png",

    // 后端数据
    packages_data: {},

    // 用户行为 信息 >>>>>>>>>>>>>>
    // 是否看到过优惠券
    isShowedCoupon: false,
    // 是否领取了优惠券
    isGetCoupon: false,
    // 选择的价格包id
    selected_package_id: null,
    // 选择的优惠券id
    selected_coupon_id: 0,

    // 支付jssdk参数
    jssdk: null,

  },
  lifetimes: {
    attached() {
    },
    // 在组件实例被从页面节点树移除时执行
    detached() {
      this.init();
    },
  },
  methods: {
    init() {
      console.log("detached");
      clearTimeout(timer);
      timer = null;
      this.successCallback = null;
      this.failCallback = null;
      this.completeCallback = null;
      this.setData({
        showVipView: false,
        showWrapper: true,
        showCoupon: false,
        packages_data: {},

        isShowedCoupon: false,
        selected_coupon_id: 0,

        isGetCoupon: false,
        selected_package_id: null,
        jssdk: null,
      });
    },
    successCallback: null,
    failCallback: null,
    // 对于 支付组件而言 
    // 成功：1.就是不需要支付 且 是vip 2.支付成功  
    // 失败：1.支付失败
    process(successFunc, failFunc) {
      let that = this;
      console.log("process");
      if (!wx.getStorageSync("access_token")) {
        setTimeout(() => { that.process(successFunc, failFunc ); }, 100); return;
      }

      this.successCallback = successFunc;
      this.failCallback = failFunc;
      // console.log('successCallback',successFunc,'failCallback',failFunc);
      this.checkPayStatus({ successFunc, failFunc })
        .then(() => {
          console.log("【需要支付,线程托管给支付组件】");
          that.setData({
            showVipView: true,
            showWrapper: true,
          });
          setTimeout(() => {
            that.countDown()
          }, 100);
        })
        .catch(() => {
          // 不需要支付的流程
          console.log("不需要支付");
          this.successTodo();
        });
    },
    // ----------------------------------------- 网络请求部分 -----------------------------------------
    // 检测是否支付
    checkPayStatus() {
      wx.showLoading({ title: "加载中", mask: true });
      return new Promise((resolve, reject) => {//resolve 需要支付 reject 不需要支付
        let that = this;
        wx.request({
          url: baseUrl + "/api/subscribe/packages",
          method: "POST",
          data: {
            brand: sys.brand, // 手机品牌 iPhone
            model: sys.model, // 手机型号 iPhone X
            system: sys.system, // 操作系统版本 iOS 10.0.1
            network: getApp().globalData.currentNetwork || "unknown", // 当前网络状态
          },
          header: {
            Authorization: wx.getStorageSync("access_token"),
            "x-device-brand": sys.brand || "unknown",
            // 当前 页面栈 最后一个页面的路径
            "x-device-path": getCurrentPages()[getCurrentPages().length - 1].route,
            "x-device-model": sys.model || "unknown",
            "x-device-system": sys.system || "unknown",
            "x-device-network": getApp().globalData.currentNetwork || "unknown",
          },
          success(res) {
            wx.hideLoading();
            console.log('[￥ 检测是否支付] ', res.data);
            const ret = res.data;
            if (ret.code == 1) {
              that.setData({
                packages_data: ret.data || {},
                selected_package_id: ret.data.price_list ? ret.data.price_list[0].id : null,
              });
              // 改为 判断的动作 移动到 第二级 这里 是第三级 所以不需要判断
              resolve();
            }
          },
          fail: (err) => {
            wx.hideLoading();
            reject(err);
          },
        });
      });
    },
    // 发起支付
    getPayJssdk(selected_package_id, coupon_id) {
      // 没有获取到jssdk参数，调用获取jssdk参数接口
      // 将不能使用优惠券的价格包的coupon_id设置为0
      this.data.packages_data.price_list.forEach((item) => {
        if (item.id == selected_package_id) {
          coupon_id = item.can_use_coupon ? coupon_id : 0;
        }
      });
      console.log("发送信息为：" + selected_package_id + " " + coupon_id);
      wx.request({
        url: baseUrl + "/api/subscribe/payment",
        method: "POST",
        data: {
          price_id: selected_package_id,
          coupon_id: coupon_id,

          brand: sys.brand, // 手机品牌 iPhone
          model: sys.model, // 手机型号 iPhone X
          system: sys.system, // 操作系统版本 iOS 10.0.1
          network: getApp().globalData.currentNetwork || "unknown", // 当前网络状态
          path: getCurrentPages()[getCurrentPages().length - 1].route, // 当前 页面栈 最后一个页面的路径
        },
        header: {
          Authorization: wx.getStorageSync("access_token"),
          "x-device-brand": sys.brand || "unknown",
          // 当前 页面栈 最后一个页面的路径
          "x-device-path": getCurrentPages()[getCurrentPages().length - 1].route,
          "x-device-model": sys.model || "unknown",
          "x-device-system": sys.system || "unknown",
          "x-device-network": getApp().globalData.currentNetwork || "unknown",
        },
        success: (res) => {
          if (res.data.code == 1) {
            this.data.jssdk = res.data.data.jssdk;
            this.requestPayment();
          }
        },
        fail: (err) => {
          wx.hideLoading(), console.log("获取支付错误", err);
          wx.showModal({
            content: err.msg || "网络错误", showCancel: false,
          });
        },
      });
    },
    // 调用微信发起支付
    requestPayment() {
      const that = this;
      let jssdk = this.data.jssdk;
      wx.requestPayment({
        timeStamp: jssdk.timeStamp,
        nonceStr: jssdk.nonceStr,
        package: jssdk.package,
        signType: jssdk.signType,
        paySign: jssdk.paySign,
        success(res) {
          wx.showModal({
            content: "支付成功",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                that.successTodo();
              }
            },
          });
        },
        fail(err) { console.log("支付失败", err); },
        complete(res) { wx.hideLoading(); console.log("支付完成", res); },
      });
    },
    //----------------------------------------- 自定义方法 -----------------------------------------
    countDown() {
      let that = this;
      let now = new Date();
      // console.log('packages_data',that.data.packages_data.pay_config)
      let endTime = that.data.packages_data.pay_config.end_today_timestamp * 1000
      let t = endTime - now.getTime();
      let h = 0;
      let m = 0;
      let s = 0;
      let ms = 0;
      if (t >= 0) {
        h = Math.floor((t / 1000 / 60 / 60) % 24);
        m = Math.floor((t / 1000 / 60) % 60);
        s = Math.floor((t / 1000) % 60);
        ms = Math.floor(t % 1000);
      }
      that.setData({
        countHour: h.toString().padStart(2, "0"),
        countMinute: m.toString().padStart(2, "0"),
        countSecond: s.toString().padStart(2, "0"),
        countMillisecond: ms,
      });
      timer = setTimeout(() => that.countDown(), 40);
    },
    //----------------------------- 页面响应 -----------------------------
    // 首先看是不是 配置了 红包 也就是看 packages_data.coupon_info 是否有值 
    onClickCloseBtn() {
      if (this.data.packages_data.coupon_info && !this.data.isShowedCoupon) {
        wx.showModal({
          // content: this.data.packages_data.pay_config.cancel_text,
          // cancelText: '再看看', confirmText: '确定', cancelColor: '#576B95', confirmColor: '#000000',
          content: this.data.packages_data.pay_config.cancel_text,
          cancelText: '确定',
          cancelColor: '#000000',

          confirmText: '再看看',
          confirmColor: '#576B95',
          success: (result) => {
            if (result.cancel) { this.setData({ showWrapper: false }); this.showCoupon(); }
          },
        });
      } else {
        this.failTodo();
      }
    },
    showCoupon() {
      if (this.data.packages_data.coupon_info) {
        this.setData({ showCoupon: true, isShowedCoupon: true });
      }
    },
    closeCoupon() {
      console.log("closeCoupon");
      wx.showModal({
        content: this.data.packages_data.coupon_info.cancel_text,
        cancelText: this.data.packages_data.coupon_info.coupon_cancel_text,
        confirmText: this.data.packages_data.coupon_info.coupon_get_text,

        cancelColor: '#000000',
        confirmColor: '#576B95',
        success: (result) => {
          if (result.confirm) {
            this.getCoupon();
          }
          else {// 取消支付相当于 直接去领取优惠券 并且 打开 选择价格包 的窗口
            this.failTodo();
          }
        },
      });
    },
    // 领取优惠券
    getCoupon() {
      console.log("[￥ 领取优惠券] ", this.data.packages_data.coupon_info.id);
      this.setData({ showCoupon: false, showWrapper: true, isGetCoupon: true, selected_coupon_id: this.data.packages_data.coupon_info.coupon_id });
    },
    handleTap($event) {
      console.log('[￥ 选择价格包] ', $event.currentTarget.dataset.id);
      let _id = $event.currentTarget.dataset.id;
      this.setData({ selected_package_id: _id });

    },
    successTodo() {
      console.log("successTodo", this.successCallback);
      this.successCallback();
      this.setData({
        showVipView: false,
        showWrapper: false,
        showCoupon: false,
      });
      this.init();
    },
    failTodo() {
      //先判断是否看过红包 如果看过红包 则直接关闭窗口 走失败回调；如果没有看过红包 则打开红包窗口
      if (this.data.isShowedCoupon) {
        console.log("failTodo", this.failCallback);
        this.failCallback();
        this.setData({
          showVipView: false,
          showWrapper: false,
          showCoupon: false,
        });
        this.init();
      } else {

      }
    },
    // 点击去支付按钮
    onClickToPay() {
      wx.showLoading({ title: "加载中", mask: true });
      console.log("[￥ 去支付] ", this.data.selected_package_id, this.data.selected_coupon_id);
      this.getPayJssdk(this.data.selected_package_id, this.data.selected_coupon_id);
    },
  },

});
