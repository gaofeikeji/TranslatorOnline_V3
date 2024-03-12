import * as xy from '../utils/common.js'

var globalHostMpss = xy.isDevelopmentStatusUrl();
var appId = "wx508f14feac06cecd";
var payPath = "/pages/pay/pay";

const sys = wx.getSystemInfoSync();
let trade_res = null;
let scenes = null;

// 小程序激励广告
let payMode = {
  successCallback: null,
  failCallback: null,
  isJumpToPay: false,
  // trade_no: null,
  /**
   * 创建支付单
   * @param {Function} _successCallback 支付成功回调
   * @param {Function} _failCallback 支付失败回调
   * @returns {Promise} 返回支付单id
   */
  async getHasBeenPayed(scene, _successCallback, _failCallback) {
    let that = this;
    that.successCallback = _successCallback;
    that.failCallback = _failCallback;

    //创建支付单
    return new Promise((resolve, reject) => {
      // 已经创建过支付单，直接返回支付单id信息
      if (trade_res && scenes == scene) return resolve(trade_res);

      wx.request({
        url: globalHostMpss + "/api/payment",
        method: "POST",
        data: {
          scenes: scene, //场景值
          brand: sys.brand, // 手机品牌 iPhone
          model: sys.model, // 手机型号 iPhone X
          system: sys.system, // 操作系统版本 iOS 10.0.1
          network: getApp().globalData.currentNetwork, // 当前网络状态 wifi 4g 3g 2g none unknown
        },
        header: {
          Authorization: wx.getStorageSync("access_token"),
        },
        success(res) {
          console.log(res);
          if (res.data.code == 1) {
            // V2 版本 将支付单id存入全局变量
            trade_res = res.data.data;
            scenes = scene;
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
          let _price = res.price;
          wx.setStorageSync("trade_no", _trade_no);

          appId = res.payment_config.appid || "wx508f14feac06cecd";
          payPath = res.payment_config.path || "/pages/pay/pay";

          wx.showModal({
            content: res.desc || "支付获得特权",
            success(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                that.openEmbeddedMiniProgram(_trade_no, _price);
                return;
              }
              if (res.cancel) {
                console.log("用户点击取消");
                that.failCallback();
                return;
              }
            },
          });
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
   * 打开支付小程序
   * @param {String} trade_no 支付单id
   */
  openEmbeddedMiniProgram(trade_no, price) {
    // console.log('半屏打开支付小程序,trade_no', trade_no)
    let that = this;
    wx.openEmbeddedMiniProgram({
      appId: appId,
      path: payPath,
      extraData: {
        trade_no: trade_no,
        price: price,
      },
      // envVersion: 'develop',//打开开发版
      // envVersion: 'trial',//打开体验版
      envVersion: "release", //打开正式版
      success(res) {
        console.log("打开成功", res);
        // V2 版本 打开成功后 将之前存储全局的支付单id 清空
        trade_res = null;

        that.isJumpToPay = true;
      },
      fail(res) {
        console.log("打开失败", res);
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
        url: globalHostMpss + "/api/payment/check",
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
        that.isJumpToPay = false;
      })
      .catch((err) => {
        console.log("支付失败执行操作", err);
        wx.hideLoading()
        that.isJumpToPay = false;
      });
  },
  /**
   * @description: 检查支付状态
   * @param {*}
   * @return {Promise} 返回支付状态 need_pay: true 需要支付 false 不需要支付
   */
  checkPayStatus() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: globalHostMpss + "/api/payment",
        method: "POST",
        data: {
          scenes: "template_unlock", //场景值
        },
        header: {
          Authorization: wx.getStorageSync("access_token"),
        },
        success(res) {
          if (res.data.code == 1) {
            resolve(res.data.data);
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },
};

export { payMode };
