const baseUrl = "https://usercenter.mp.lighthg.com";

var plugin = requirePlugin("wxacommentplugin");
// components/ToRate/ToRate.js
Component({
  properties: {
    // 支付场景值
    scene: {
      type: String,
      value: "template_unlock",
    },
    //当前页面的路径
    path: {
      type: String,
      value: "",
    },
    // 感谢评价的文案
    thankRateStr: {
      type: String,
      value: "",
    },
    // 评价出现的时机的场景值
    rateScene: {
      type: String,
      value: "",
    },
    // 引用页面 传入的是否可以展示的控制
    canShow: {
      type: Boolean,
      value: false,
    },
    // 是否每次展示 如果为true 则只要没评价每次都会展示 否则为一天一次
    alwaysShow: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    //渲染控制
    show: false,
    // showed: wx.getStorageSync("rate_time"),
    canShow: false,
    url: "https://usercenter.mp.lighthg.com/api/config/default",

    image_config: {
      image_1:
        "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/qtqpzsgPAjY2aZy4hlAXM3uXrF3sCsiXfsK0GE0D.png",
      image_2:
        "https://mpss-1253713495.cos.ap-shanghai.myqcloud.com/business_license/SBHuQqvZUhQuFeNEOFmo3DtQlkWwFp26TzsB7oZA.png",
    },
    request_comment: {},

    //star展示数组
    starArr: [0, 0, 0, 0, 0],
    starNum: 0,
  },
  ready() {},
  methods: {
    // ------------------------------ 事件 ------------------------------
    // 关闭
    onClickClose() {
      this.setData({
        show: false,
      });
    },
    // 点击去评价
    goRate() {
      console.log("【goRate】");
      plugin.openComment({
        success: (res) => {
          console.log("plugin.openComment success", res);
          this.successCallback();
        },
        fail: (res) => {
          console.log("plugin.openComment fail", res);
          // 只有在用户取消时才会返回-3 其他情况分别是 用户已经评价过 当前版本不支持
          if (res.errCode == -3) {
            console.log("用户取消");
            this.failCallback();
          } else {
            this.successCallback();
          }
        },
      });
    },
    // 点击星星
    onClickStar(e) {
      // 如果已经评价过 则不允许再次评价
      if (this.data.starArr[0] != 0) {
        return;
      }
      let _index = e.currentTarget.dataset.index;
      let _starArr = this.data.starArr;
      for (let i = 0; i < _starArr.length; i++) {
        if (i <= _index) {
          _starArr[i] = 1;
        } else {
          _starArr[i] = 0;
        }
      }
      this.setData({
        starArr: _starArr,
      });
      // 展示300ms后关闭 然后去判断是否要跳转到真的评价页面
      setTimeout(() => {
        this.setData({
          show: false,
        });
        this.judgeAndShowRateWithStar();
      }, 300);
    },
    // 根据模拟点击的星星数量 判断是否要跳转到真的评价页面
    judgeAndShowRateWithStar() {
      console.log("【judgeAndShowRateWithStar】");
      let _starArr = this.data.starArr;
      let _starNum = 0;
      for (let i = 0; i < _starArr.length; i++) {
        if (_starArr[i] == 1) {
          _starNum++;
        }
      }
      this.setData({
        starNum: _starNum,
      });
      console.log("【judgeAndShowRate】", _starNum);
      // 如果用户给的星星数量大于4 则跳转到真的评价页面
      // 否则不跳转 直接弹出答谢语 并且上报评价
      if (_starNum > 4) {
        // wx.showToast({
        //   title: '已将评价复制到剪贴板',
        //   icon: "none",
        //   duration: 800,
        // });
        wx.setClipboardData({
          data: this.data.request_comment.comment_copyright,
          success: function (res) {
            wx.showToast({
              title: '评价内容已复制，可直接粘贴哟',
              icon:'none',
          });
            // wx.getClipboardData({
            //   success: function (res) {
            //     console.log(res.data); // data
            //   },
            // });
          },
        });
        setTimeout(() => {
          this.goRate();
        }, 300);
      } else {
        this.oneToFourSuccessCallback();
      }
    },
    // 1-4星 成功回调
    oneToFourSuccessCallback() {
      this.setData({
        show: false,
      });
      // 此处因为 去水印 有单独的上报接口 所以不需要再次上报
      this.reportComment();
      wx.showToast({
        title: this.data.request_comment.comment_low_star_tip,
        icon: "none",
        duration: 1200,
      });
      setTimeout(() => {
        this.triggerEvent("RateSuccess");
      }, 1200);
    },
    successCallback() {
      this.setData({
        show: false,
      });
      // 此处因为 去水印 有单独的上报接口 所以不需要再次上报
      this.reportComment();
      // wx.showToast({
      //   title: this.data.request_comment.comment_low_star_tip,
      //   icon: "none",
      //   duration: 1200,
      // });
      this.triggerEvent("RateSuccess");
    },
    failCallback() {
      this.triggerEvent("RateFail");
    },
    // ------------------------------ 网络请求 ------------------------------
    getRequestComment() {
      return new Promise((resolve, reject) => {
        // 获取当前页面栈
        var pages = getCurrentPages();
        let _path = "";
        if (wx.getSystemInfoSync().system.indexOf("iOS") != -1) {
          _path = pages[pages.length - 1].route;
        } else {
          _path = pages[pages.length - 1].__route__;
        }
        console.log("当前页面路径", _path);
        let _data = {
          appid: wx.getAccountInfoSync().miniProgram.appId,
          brand: wx.getSystemInfoSync().brand,
          model: wx.getSystemInfoSync().model,
          system: wx.getSystemInfoSync().system,
          //当前页面路径
          path: _path,
          rateScene: this.data.rateScene,
          scenes: this.data.scene,
        };
        wx.request({
          url: baseUrl + "/api/config/comment",
          method: "GET",
          data: _data,
          header: {
            Authorization: wx.getStorageSync("access_token"),
          },
          success: (res) => {
            console.log("【请求评价组件】", res, "本次发送的data", _data);
            // --test
            // res.data.data.request_comment.status = true

            this.setData({
              request_comment: res.data.data.request_comment,
              canShowGlobal: res.data.data.request_comment.status,
            });
            resolve(res);
          },
          fail: (res) => {
            console.log("【请求评价组件】", res);
            reject(res);
          },
        });
      });
    },
    // 上报成功评价
    reportComment() {
      // 星星数量
      return new Promise((resolve, reject) => {
        wx.request({
          url: baseUrl + "/api/report/comment",
          method: "POST",
          data: {
            star: this.data.starNum,
          },
          header: {
            Authorization: wx.getStorageSync("access_token"),
          },
          success: (res) => {
            console.log("【上报评价成功】", res);
            resolve(res);
          },
          fail: (res) => {
            console.log("【上报评价失败】", res);
            reject(res);
          },
        });
      });
    },
    // 测试用 删除评价结果 {{host}}/api/report/clear_comment
    clearComment() {
      return new Promise((resolve, reject) => {
        wx.request({
          url: baseUrl + "/api/report/clear_comment",
          method: "POST",
          data: {},
          header: {
            Authorization: wx.getStorageSync("access_token"),
          },
          success: (res) => {
            console.log("【清除评价结果】", res);
            resolve(res);
          },
          fail: (res) => {
            console.log("【清除评价结果】", res);
            reject(res);
          },
        });
      });
    },
    // ------------------------------ 评价展示控制 ------------------------------
    // 调用展示 请求文案 判断是否可以展示 展示
    judgeAndShow() {
      let that = this;
      return new Promise((resolve, reject) => {
        that
          .getRequestComment()
          .then((res) => {
            that.judgeStorage();
            if (that.judgeAndShowRate()) {
              // 清除不能点击的状态
              that.setData({
                starArr: [0, 0, 0, 0, 0],
              });
              that.triggerEvent("RateShowSuccess");
              resolve(true);
            } else {
              reject();

              that.triggerEvent("RateShowFail");
            }
          })
          .catch((res) => {
            reject();
            that.triggerEvent("RateShowFail");
          });
      });
    },
    //判断本地缓存是否可以展示
    judgeStorage() {
      if (wx.getStorageSync("rate_time")) {
        let _rate_time = wx.getStorageSync("rate_time");
        let _date = new Date();
        let _time = _date.getTime() - new Date(_rate_time).getTime();
        if (_time > 24 * 60 * 60 * 1000) {
          this.setData({
            canShowStorage: true,
          });
        } else {
          this.setData({
            canShowStorage: this.data.alwaysShow ? true : false,
          });
        }
      } else {
        this.setData({
          canShowStorage: true,
        });
      }
    },
    // 去展示评价
    judgeAndShowRate() {
      console.log(
        "【judgeAndShowRate】",
        this.data.canShowGlobal,
        this.data.canShowStorage,
        this.data.canShow
      );
      if (
        this.data.canShowGlobal &&
        this.data.canShowStorage &&
        this.data.canShow
      ) {
        this.setData({
          show: true,
        });
        wx.setStorageSync("rate_time", new Date());
        return true;
      } else {
        // this.triggerEvent("RateShowFail");
        return false;
      }
    },
  },
});
