const baseUrl = "https://usercenter.mp.gaofeikeji.top";
const sys = wx.getSystemInfoSync();
let trade_res = null,
  appId = null,
  payPath = null,
  scenes = null,
  jssdk = null,
  oldscenes = null;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scene: {
      type: String,
      value: "template_unlock",
    },
    mtop: {
      type: String,
      value: "30%",
    },
    without: {
      type: String,
      value: "0",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    mask: false, // 遮罩层
    redPacket: false, // 红包
    showSale: false, // 弹窗
    minutes: 0, // 分钟
    seconds: 0, // 秒数
    config: {}, // 支付配置
    isJumpToPay: false, // 是否跳转到支付页面
    isOnce: true, // 是否只显示一次
    isViewCoupon: false, // 是否有折扣券

    pay_status: "", // 订单状态
    order_status: "", // 订单状态

    without: 0, // 是否跳转到外部嵌入式小程序支付
    currentRedPacket: 0, // 当前 用户视角得知了第几个红包

    redPacketInfo: {
      imageBk1:
        "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/oFvzAVRxonxj1TznTRAa72n5Q2twxhGXbgVd0GGn.png",
      imageBk2:
        "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/2yksOjdiQldLPFWXEVcfaZhdEdcnGdq0QtJ1qqqd.png",
    },
    currentRedPacketImage:
      "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/oFvzAVRxonxj1TznTRAa72n5Q2twxhGXbgVd0GGn.png",

    //动画部分
    animationData: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    successCallback: null,
    failCallback: null,
    timer: null,
    _successPay: null,

    init() {
      this.setData({
        mask: false, // 遮罩层
        redPacket: false, // 红包
        showSale: false, // 弹窗
        minutes: 0, // 分钟
        seconds: 0, // 秒数
        config: {}, // 支付配置
        isJumpToPay: false, // 是否跳转到支付页面
        isOnce: true, // 是否只显示一次
        isViewCoupon: false, // 是否有折扣券
    
        pay_status: "", // 订单状态
        order_status: "", // 订单状态
    
        without: 0, // 是否跳转到外部嵌入式小程序支付
        currentRedPacket: 0, // 当前 用户视角得知了第几个红包
    
        redPacketInfo: {
          imageBk1:
            "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/oFvzAVRxonxj1TznTRAa72n5Q2twxhGXbgVd0GGn.png",
          imageBk2:
            "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/2yksOjdiQldLPFWXEVcfaZhdEdcnGdq0QtJ1qqqd.png",
        },
        currentRedPacketImage:
          "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/oFvzAVRxonxj1TznTRAa72n5Q2twxhGXbgVd0GGn.png",
    
        //动画部分
        animationData: {},
      });
      trade_res = null;
      appId = null;
      payPath = null;
      scenes = null;
      jssdk = null;
      oldscenes = null;
      // 清除计时器
      clearInterval(this.timer);
    },

    // 开启支付弹窗
    openPay() {
      // 判断是否只显示一次
      const isOnce = this.data.isOnce;
      console.log("isOnce:", isOnce);
      if (isOnce) {
        this.setData({
          showSale: true,
          redPacket: false,
          mask: true,
        });
        this.countDown();
      }
    },

    // 打开嵌入式小程序
    openEmbeddedMiniProgram(trade_no, price, coupon_id) {
      const config = this.data.config;
      let that = this;
      wx.openEmbeddedMiniProgram({
        appId: config.payment_config.appid,
        path: config.payment_config.path,
        extraData: {
          trade_no: trade_no,
          price: price,
          coupon_id: coupon_id,
        },
        // envVersion: 'develop',//打开开发版
        // envVersion: 'trial',//打开体验版
        envVersion: "release", //打开正式版
        success(res) {
          console.log("打开成功", res);
          trade_res = null;
          // 只显示一次弹窗 不再显示
          that.setData({ isJumpToPay: true, isOnce: false });
        },
        fail(res) {
          wx.showModal({
            title: "提示",
            content: "打开失败，请重试" + res.errMsg,
            showCancel: false,
            confirmText: "确定",
            success(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                that.failCallback();
              }
            },
          });
        },
      });
    },
    // 跳转到其他小程序
    jumpToOtherMiniProgram(trade_no, price, coupon_id) {
      const config = this.data.config;
      let that = this;
      wx.navigateToMiniProgram({
        appId: config.payment_config.appid,
        path: config.payment_config.path,
        extraData: {
          trade_no: trade_no,
          price: price,
          coupon_id: coupon_id,
        },
        envVersion: "develop", //打开开发版
        // envVersion: 'trial',//打开体验版
        // envVersion: "release", //打开正式版
        success(res) {
          console.log("打开成功", res);
          trade_res = null;
          // 只显示一次弹窗 不再显示
          that.setData({ isJumpToPay: true, isOnce: false });
        },
        fail(res) {
          wx.showModal({
            title: "提示",
            content: "打开失败，请重试" + res.errMsg,
            showCancel: false,
            confirmText: "确定",
            success(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                that.failCallback();
              }
            },
          });
        },
      });
    },
    /**
     * 查询支付状态 1秒一次
     * @param {String} trade_no 支付单id
     * @returns {Promise} 返回支付状态
     */
    pollingPayStatus() {
      let that = this;
      let trade_no = wx.getStorageSync("trade_no");
      return new Promise((resolve, reject) => {
        wx.request({
          url: baseUrl + "/api/payment/check",
          method: "GET",
          data: {
            trade_no: trade_no, //支付单id
          },
          header: {
            Authorization: wx.getStorageSync("access_token"),
          },
          success(res) {
            console.log(
              "查询到订单号为",
              trade_no,
              "的支付状态,支付状态为",
              res.data.data.pay_status
            );
            if (res.data.code == 1) {
              if (res.data.data.pay_status == 1) {
                // 支付成功 关闭定时器 清空支付单id 清空jssdk参数 清空支付状态
                clearInterval(that.timer);
                wx.removeStorageSync("trade_no");
                trade_res = null;
                jssdk = null;

                console.log("支付成功");
                resolve(res.data.data);
              } else {
                console.log("支付失败");
                reject(res.data.data);
              }
            } else {
              console.log("支付失败");
              reject(res.data.data);
            }
          },
          fail: (err) => {
            console.log(err);
            reject(err);
          },
        });
      })
        .then((res) => {
          console.log("支付成功", res);
          wx.showModal({
            content: "支付成功",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                that.successCallback();
              }
            },
          });
          that.setData({ isJumpToPay: false });
        })
        .catch((err) => {
          wx.hideLoading();
          console.log("支付失败执行操作", err);
          that.setData({ isJumpToPay: false });
        });
    },
    // 打开半屏弹窗支付
    immediatePayment() {
      this.setData({
        showSale: false,
        redPacket: false,
        mask: false,
        isOnce: false,
      });
      this.triggerEvent("payment", { coupon_id: 0 });
    },
    // 折扣券打开半屏支付弹窗
    discount() {
      this.setData({
        showSale: false,
        redPacket: false,
        mask: false,
        isOnce: false,
      });
      if (this.data.currentRedPacket == 1) {
        this.triggerEvent("payment", {
          coupon_id: this.data.config.coupon_info.coupon_id,
        });
      } else if (this.data.currentRedPacket == 2) {
        this.triggerEvent("payment", {
          coupon_id: this.data.config.coupon_info_2.coupon_id,
        });
      }
      // this.triggerEvent("payment", {
      //   coupon_id: this.data.config.coupon_info.coupon_id,
      // });
    },
    // 关闭弹窗 显现红包
    close() {
      const config = this.data.config;
      this.setData({ isOnce: false });
      if (config.coupon_info?.coupon_id) {
        wx.showModal({
          title: "提示",
          content: "确定要放弃领取吗？",
          confirmText: "继续领取",
          cancelText: "放弃",
          success: (res) => {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              this.setData({
                showSale: false,
                redPacket: true,
                isViewCoupon: true,
                currentRedPacket: 1, //当前用户视角得知了第一个红包
              });
            }
          },
        });
      } else {
        this.setData({
          showSale: false,
          redPacket: false,
          mask: false,
        });
      }
    },
    // 关闭红包 关闭遮罩层
    giveup() {
      let that = this;
      console.log("当前红包视角是", that.data.currentRedPacket, "id=", that.data.config.coupon_info.coupon_id);
      //弹出提示框 询问是否放弃领取
      if (that.data.currentRedPacket == 1 && that.data.config.coupon_info_2.coupon_id) {
        wx.showModal({
          title: "提示",
          content: "确定要放弃领取吗？",
          confirmText: "继续领取",
          cancelText: "放弃",
          success: (res) => {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              //判断是否有红包2
              that.closeRedPacketAnimation();
              setTimeout(() => {
                //将红包2的信息赋值给红包
                // let _coupon_info = that.data.config.coupon_info_2;
                let _coupon_info = JSON.parse(
                  JSON.stringify(that.data.config.coupon_info_2)
                );
                that.setData({
                  config: {
                    ...that.data.config,
                    coupon_info: _coupon_info,
                  },
                  currentRedPacketImage: that.data.redPacketInfo.imageBk2,
                  redPacket: true,
                  mask: true,
                  currentRedPacket: 2, //当前用户视角得知了第二个红包
                });
                that.showRedPacketAnimation();
                // 同时更新全局的信息
                trade_res = {
                  ...trade_res,
                  coupon_info: _coupon_info,
                };
              }, 500);
            }
          },
        });
      } else {
        setTimeout(() => {
          that.setData({
            redPacket: false,
            mask: false,
          });
        }, 500);
        that.closeRedPacketAnimation();
      }
    },
    // 红包弹出的动画
    showRedPacketAnimation() {
      //创建动画
      var animation = wx.createAnimation({
        duration: 250,
        timingFunction: "ease",
      });
      this.animation = animation;

      animation.scale(1).step({ delay: 250 });

      this.setData({
        animationData: animation.export(),
      });
    },
    // 红包关闭直到缩小的动画
    closeRedPacketAnimation() {
      //创建动画
      var animation = wx.createAnimation({
        duration: 250,
        timingFunction: "ease",
      });
      this.animation = animation;

      // 弹出动画：先放大到1.2倍，再缩放回1倍
      animation.scale(0).step({ delay: 250 });

      this.setData({
        animationData: animation.export(),
      });
    },
    // 倒计时方法
    countDown() {
      let minutes = this.data.minutes;
      let seconds = this.data.seconds;
      if (minutes > 0 || seconds > 0) {
        this.timer = setInterval(() => {
          if (seconds == 0) {
            minutes--;
            seconds = 59;
          } else {
            seconds--;
          }
          this.setData({
            minutes: minutes,
            seconds: seconds,
          });
          if (minutes == 0 && seconds == 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      }
    },
    // 检测是否支付
    checkPayStatus({ successFunc, failFunc }) {
      let that = this;
      console.log("检测是否支付");
      if (trade_res && trade_res.need_pay && scenes == that.properties.scene) {
        console.log("已经创建过支付单，直接返回支付单id信息", trade_res, 'scenes:', scenes);
        that.setData({ config: trade_res });
        if (!trade_res.need_pay) {
          typeof successFunc == "function" && successFunc();
        } else {
          typeof failFunc == "function" && failFunc();
        }
        return;
      } else {
        console.log("没有创建过支付单，重新创建");
        // 清楚之前所有订单信息 sdk参数 等
        trade_res = null;
        jssdk = null;
        // that.setData({  isOnce: true });
      }
      wx.request({
        url: baseUrl + "/api/payment",
        method: "POST",
        data: {
          scenes: this.properties.scene, //场景值
          brand: sys.brand, // 手机品牌 iPhone
          model: sys.model, // 手机型号 iPhone X
          system: sys.system, // 操作系统版本 iOS 10.0.1
          network: getApp().globalData.currentNetwork || "unknown", // 当前网络状态
        },
        header: {
          Authorization: wx.getStorageSync("access_token"),
        },
        success(res) {
          console.log(res);
          const ret = res.data;
          if (ret.code == 1) {
            trade_res = ret.data;
            scenes = that.properties.scene;
            wx.setStorageSync("trade_no", ret.data.trade_no);
            that.setData({
              config: ret.data,
            });
            if (that.data.minutes == 0) {
              that.setData({
                minutes: ret.data.price_config?.count_down
                  ? ret.data.price_config.count_down
                  : 0,
              });
            }
          }
          if (!ret.data.need_pay) {
            typeof successFunc == "function" && successFunc();
          } else {
            typeof failFunc == "function" && failFunc();
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    },
    /**
     * @description 创建支付单
     * @param {Function} _successCallback 支付成功回调
     * @param {Function} _failCallback 支付失败回调
     * @returns {Promise} 返回支付单id
     */
    getHasBeenPayed(_successCallback, _failCallback, coupon_id) {
      let config = this.data.config;
      let that = this;

      this.successCallback = _successCallback;
      this.failCallback = _failCallback;

      //创建支付单
      return new Promise((resolve, reject) => {
        // 已经创建过支付单，直接返回支付单id信息
        
        if (trade_res && trade_res.need_pay && scenes == this.properties.scene && oldscenes == this.properties.scene) {
          let _trade_res = JSON.parse(JSON.stringify(trade_res));
          let _jssdk = JSON.parse(JSON.stringify(jssdk));
          console.log("已经创建过支付单，直接返回支付单id信息", _trade_res, 'scenes:', scenes, "jssdk:", _jssdk, "oldscenes:", oldscenes);
          return resolve(trade_res);
        }

        wx.showLoading({ title: "加载中", mask: true });
        wx.request({
          url: baseUrl + "/api/payment",
          method: "POST",
          data: {
            scenes: that.properties.scene, //场景值
            brand: sys.brand, // 手机品牌 iPhone
            model: sys.model, // 手机型号 iPhone X
            system: sys.system, // 操作系统版本 iOS 10.0.1
            network: getApp().globalData.currentNetwork, // 当前网络状态 wifi 4g 3g 2g none unknown
          },
          header: {
            Authorization: wx.getStorageSync("access_token"),
          },
          success(res) {
            wx.hideLoading();
            console.log(res);
            if (res.data.code == 1) {
              trade_res = res.data.data;
              scenes = that.properties.scene;
              oldscenes = that.properties.scene;
              resolve(res.data.data);
            }
          },
          fail: (err) => {
            console.log(err);
            reject(err);
          },
        });
      })
        .then((res) => {
          let need_pay = res.need_pay;
          if (need_pay) {
            console.log("创建支付单成功，返回支付单id", res.trade_no);
            let _trade_no = res.trade_no;
            let price = coupon_id == 0 ? res.price : res.coupon_info.price;
            // 修改为根据当前红包视角来获取价格
            if (that.data.currentRedPacket == 2) {
              price = res.coupon_info_2.price;
            }
            wx.setStorageSync("trade_no", _trade_no);

            appId = res.payment_config.appid;
            payPath = res.payment_config.path;
            console.log(res);
            this.setData({
              config: res,
              without: res.payment_config.is_jump == 1 ? 1 : 0,
            });
            // 判断是否需要跳转到外部嵌入式小程序支付还是内部支付
            // if (that.properties.without == 0) {
            if (that.data.without == 0) {
              console.log("内部支付，不跳转=>", _trade_no, price, coupon_id);
              that.getPayJssdk(config.trade_no, coupon_id);
            } else {
              console.log("外部支付，携带参数跳转=>", config.trade_no, price, coupon_id);
              this.openEmbeddedMiniProgram(config.trade_no, price, coupon_id);
              // //test
              // this.jumpToOtherMiniProgram(config.trade_no, price, coupon_id);
            }
          } else {
            console.log(
              "请求 创建支付单 成功，返回结果为不需要支付，直接获取特权"
            );
            that.successCallback();
          }
        })
        .catch((err) => {
          console.log(err);
          wx.showModal({
            title: "提示",
            content: "创建订单失败，请重试" + err,
            showCancel: false,
            confirmText: "确定",
            success(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                that.failCallback();
              }
            },
          });
        });
    },
    /**
     * @description 发起支付
     * @param {String} trade_no 支付单id
     * @param {String} coupon_id 折扣券id
     */
    getPayJssdk(trade_no, coupon_id) {
      // 如果已经获取到jssdk参数，直接调用微信支付
      if (jssdk) {
        this.requestPayment();
        return;
      }

      // 没有获取到jssdk参数，调用获取jssdk参数接口
      wx.request({
        url: baseUrl + "/api/payment/pay",
        method: "POST",
        data: {
          trade_no: trade_no,
          coupon_id: coupon_id,
        },
        header: {
          Authorization: wx.getStorageSync("access_token"),
        },
        success: (res) => {
          console.log("发送订单号信息为：", trade_no, "支付接口返回：", res);
          if (res.data.code == 1) {
            jssdk = res.data.data.jssdk;
            this.setData({
              order_status: "find",
              pay_status: 0,
            });
            this.requestPayment();
          } else {
            this.setData({
              order_status: "RECORD_NOT_FOUND ",
              pay_status: 0,
            });
            wx.showModal({
              content: res.data.msg,
              showCancel: false,
            });
          }
        },
        fail: (err) => {
          wx.hideLoading();
          console.log("获取支付错误", err);
          // wx.showToast({
          //   title: "获取支付错误" + err,
          //   icon: "none",
          //   duration: 2000,
          // });
          wx.showModal({
            content: err.msg || "网络错误",
            showCancel: false,
          });
        },
      });
    },
    /**
     * @description 调用微信发起支付
     */
    requestPayment() {
      const that = this;
      wx.requestPayment({
        timeStamp: jssdk.timeStamp,
        nonceStr: jssdk.nonceStr,
        package: jssdk.package,
        signType: jssdk.signType,
        paySign: jssdk.paySign,
        success(res) {
          console.log(
            "订单号为",
            that.data.config.trade_no,
            "的订单支付成功：",
            res
          );
          wx.showModal({
            content: "支付成功",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                // 支付成功 清除定时器 清除支付单id 清除jssdk参数 清除支付状态
                trade_res = null;
                jssdk = null;
                // that.setData({ isonce: false });
                that.successCallback();
              }
            },
          });
        },
        fail(err) {
          console.log("支付失败", err);
        },
      });
    },
    // 单纯的查询支付状态
    getHasBeenPayedSelect(scenes) {
      let that = this;

      //创建支付单
      return new Promise((resolve, reject) => {
        wx.request({
          url: baseUrl + "/api/payment",
          method: "POST",
          data: {
            scenes: scenes, //场景值
            brand: sys.brand, // 手机品牌 iPhone
            model: sys.model, // 手机型号 iPhone X
            system: sys.system, // 操作系统版本 iOS 10.0.1
            network: getApp().globalData.currentNetwork, // 当前网络状态 wifi 4g 3g 2g none unknown
          },
          header: {
            Authorization: wx.getStorageSync("access_token"),
          },
          success(res) {
            if (res.data.code == 1) {
              // console.log('查询支付状态', res);
              resolve(res.data.data);
            }
          },
          fail: (err) => {
            console.log('查询支付状态失败', err);
            reject(err);
          },
        });
      })
    },
  },
  lifetimes: {
    async attached() { },
    detached() {
      console.log("【支付组件】【初始化数据】");
      this.init();
    },
  },
});
