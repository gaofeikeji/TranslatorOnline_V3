var app = getApp();
const sys = wx.getSystemInfoSync();
const log = require('../../pages/log.js')
const { adVideoUtils } = require('../custom-ads/Rewarded-Ads/index.js');
Component({
  properties: {
    action_info: {
      type: Object,
      value: null
    }
  },

  data: {
    rateScene: "",
    isShowOnceRate: false,
    isSuccessOnce: false, // 保存成功后 记录标志
    baseUrl: 'https://usercenter.mp.lighthg.com',
    showChapinAd: false,
  },
  lifetimes: {
    attached: function () {
      console.log("执行初始化 attached")
      // 声明 评价 组件
      this.rateComponent = this.selectComponent("#rate");
      this.payComponent = this.selectComponent("#pay");

      // // test 清除评论
      // this.rateComponent.clearComment();

      adVideoUtils.videoAdLoad('ad', () => {
        console.log('广告播放成功')
        this.toDosuccessCallback()  // 此处函数是某个功能 比如下载功能，未加激励广告前 直接下载  加了广告后 广告播放完成再执行此函数
      })
    },
    detached: function () {
      this.initComponent();
    },
  },
  methods: {
    globalSuccessCallback: null,
    globalFailCallback: null,
    // 初始化 组件 将data还原：
    initComponent() {
      console.log("执行初始化 detached")
      this.setData({
        rateScene: "",
        isShowOnceRate: false,
        isSuccessOnce: false, // 保存成功后 记录标志
        action_info: null,
      })
      this.globalSuccessCallback = null;
      this.globalFailCallback = null;
    },
    // 展示提醒评分
    ToShowRate(rateScene) {
      wx.showLoading({ title: "加载中", mask: true, });
      return new Promise((resolve, reject) => {
        this.setData({
          //是否展示过一次评价 防止出现因为后端配置导致或者上报评价不及时 展示了两次评价
          show_rate: this.data.isShowOnceRate ? false : true,
          //评价显示场景值
          rateScene: rateScene
        });
        // 只有在 评价场景值 为 before 的时候 才会去执行保存的回调
        if (rateScene == "before") {
          // before 情况下 如果已经通过其他方式成功过一次 当前的 提取 场景下就不再发起评价
          if (this.data.isSuccessOnce) {
            console.log("已经成功了，不需要再弹出前置评价");
            this.toDosuccessCallback();
            wx.hideLoading();
            resolve(); return;
          } else {
            this.rateComponent.judgeAndShow()
              .then((res) => { resolve(true); wx.hideLoading(); })
              .catch((err) => { reject(false); wx.hideLoading(); });
          }
          // 如果 是 保存结果后的评价 则不触发 成功的回调（成功的回调一般就是保存结果）
        } else {
          this.rateComponent.judgeAndShow()
            .then((res) => { resolve(true); wx.hideLoading(); })
            .catch((err) => { reject(false); wx.hideLoading(); });
          wx.hideLoading();
        }
      });
    },
    onRateSuccess: function (e) {
      console.log("success-index-评分成功", e);
      this.setData({
        show_rate: false,
        isShowOnceRate: true,
      });
      // 只有当评价场景是 before 才执行 回到
      this.data.rateScene == "before" && this.toDosuccessCallback();
    },
    onRateFail: function (e) {
      console.log("success-index-评分失败", e);
    },
    onRateShowFail: function (e) {
      console.log("success-index-评分展示失败 已经评过了 或者 关闭了评价的配置 ", e);
      // 只有当评价场景是 before 
      this.data.rateScene == "before" && this.toDosuccessCallback();
    },
    // 模拟点击 添加到我的小程序
    addMyMiniProgram(successCallback, failCallback) {
      console.log("去添加到我的小程序，模板3暂时不支持，直接去保存", successCallback, failCallback);
      successCallback();
    },
    // 模拟点击 广告
    showRewardAd(successCallback, failCallback) {
      if (adVideoUtils.videoAd) {
        wx.hideLoading();
        log.info('弹出模态框')
        wx.showModal({
          title: '温馨提示',
          content: '观看一次视频,即可免费获取.',
          success: (e) => {
            if (e.cancel) {
              log.info('用户点击取消')
              wx.hideLoading()
              return;
            } else {
              wx.showLoading({ title: '加载中', mask: true })
              try {
                log.info('用户点击确定')
                adVideoUtils.showAd(successCallback)
              } catch (error) {
                log.error('用户点击观看广告失败', err.errMsg, err.errCode)   
                wx.hideLoading()
                failCallback();             
              }
            }
          }
        })
      } else {
        successCallback()
      }
    },
    // 展示插屏广告 
    showChapingAd() {
      this.setData({ showChapinAd: true })
    },
    // ------------------------    支付组件    ------------------------
    // 保存结果前 调用 判断 
    onClickPreToJudgeActionInfo(_action_info, successFunc) {
      let that = this;
      return new Promise((resolve, reject) => {
        console.log("[## 后端指示的动作信息 ##]", _action_info);
        if (_action_info.before_action_type == 0) { successFunc(); resolve(); return; }
        if (_action_info.before_action_type == 1) {
          if (_action_info.other_pay_type == 99) {
            that.payComponent.process(() => { successFunc(); }, () => { });
            resolve(); return;
          } else {
            if (_action_info.other_pay_type == 0) {
              that.payComponent.process(() => { successFunc(); }, () => { successFunc(); }); resolve(); return;
            } else if (_action_info.other_pay_type == 2) {
              that.payComponent.process(() => { successFunc(); }, () => { that.ToShowRate('before'); }); resolve(); return;
            } else if (_action_info.other_pay_type == 3) {
              that.payComponent.process(() => { successFunc(); }, () => { that.addMyMiniProgram(() => { successFunc(); }, () => { successFunc(); }); }); resolve(); return;
            } else if (_action_info.other_pay_type == 4) {
              that.payComponent.process(() => { successFunc(); }, () => { that.showRewardAd(() => { successFunc(); }, () => { successFunc(); }); }); resolve(); return;
            }
          }
          resolve(); return;
        } else if (_action_info.before_action_type == 2) {
          that.ToShowRate('before'); resolve(); return;
        } else if (_action_info.before_action_type == 3) {
          that.addMyMiniProgram(() => { successFunc(); }, () => { successFunc(); }); resolve(); return;
        } else if (_action_info.before_action_type == 4) {
          that.showRewardAd(() => { successFunc(); }, () => { successFunc(); }); resolve(); return;
        }
      });
    },
    onClickAfterToJudgeActionInfo(_action_info) {
      console.log("点击了 我知道了 后去判断后端指示的动作信息"); let that = this;
      return new Promise((resolve, reject) => {
        console.log("[## 后置 指示的动作信息 ##]", _action_info);
        if (_action_info.after_action_type == 0) { resolve(); return; }
        if (_action_info.after_action_type == 1) {
          that.payComponent.process(() => { resolve(); }, () => { resolve(); });
        } else if (_action_info.after_action_type == 2) {
          that.ToShowRate('after'); resolve();
        } else if (_action_info.after_action_type == 3) {
          resolve();
        } else if (_action_info.after_action_type == 4) {// 展示激励
          that.showRewardAd(() => { resolve(); }, () => { resolve(); });
        }
        else if (_action_info.after_action_type == 5) { //展示插屏
          that.showChapingAd();
        }
      });
    },
    savePre: function (successCallback) {
      this.globalSuccessCallback = successCallback;

      if (!this.data.isSuccessOnce) {
        this.getActionInfo().then((res) => {
          this.onClickPreToJudgeActionInfo(this.data.action_info, this.toDosuccessCallback.bind(this))
        }).catch((err) => { console.log(err); })
      }
      else {
        this.toDosuccessCallback();
      }
    },
    toDosuccessCallback: function () {
      console.log('this=', this)
      this.setData({
        isSuccessOnce: true,
      })
      this.globalSuccessCallback && this.globalSuccessCallback();
    },
    getActionInfo() {//{{host}}/api/user/actions
      return new Promise((resolve, reject) => {
        if (this.data.action_info) {
          console.log("已经获取过动作信息", this.data.action_info);
          resolve(this.data.action_info);
          return;
        }
        this.request("/api/user/actions", {}, "GET").then((res) => {
          console.log("获取动作信息", res);
          this.setData({ action_info: res.data });
          // // test
          // this.data.action_info = {
          //   after_action_type: 0,
          //   before_action_type: 1,
          //   other_pay_type: 99,
          //   payment_status: false,
          // }
          resolve(res.data);
        }).catch((err) => { console.log(err); reject(err) })
      })
    },
    userLogin() {
      let that = this;
      return new Promise((resolve, reject) => {
        wx.login({
          success: (res) => {
            if (res.code) {
              that.request("/api/user/login", { code: res.code }, "POST").then((res) => {
                if (res.code === 1) {
                  resolve(res.data);
                  app.globalData.access_token = res.data.token;
                  that.indexCallback && that.indexCallback();
                } else {
                  reject(res);
                  wx.showToast({ title: res.msg, icon: "none" })
                }
              }).catch((err) => { console.log(err); reject(err) })
            }
          },
        })
      })
    },
    // 通用请求方法 用于除了用户中心外的其他业务请求
    request: function (url, data = {}, method = 'GET') {
      return new Promise((resolve, reject) => {
        //如果不是登录 同时没有token 则先去登录
        if (url != "/api/user/login" && !app.globalData.access_token) {
          this.userLogin().then(() => {
            this.request(url, data, method).then(res => resolve(res)).catch(err => reject(err))
          }).catch(err => reject(err))
          return
        }
        wx.request({
          url: this.data.baseUrl + url,
          method: method,
          header: {
            Authorization: app.globalData.access_token,
            "x-device-brand": sys.brand || "unknown",
            "x-device-path": getCurrentPages()[getCurrentPages().length - 1].route,
            "x-device-model": sys.model || "unknown",
            "x-device-system": sys.system || "unknown",
            "x-device-network": getApp().globalData.currentNetwork || "unknown",
          },
          data: data,
          success: (res) => {
            resolve(res.data);
          },
          fail: (err) => reject(err),
        });
      });
    },

  }
})