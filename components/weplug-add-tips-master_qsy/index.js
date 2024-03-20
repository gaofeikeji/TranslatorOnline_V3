const STORAGE_KEY = 'PLUG-ADD-MYAPP-KEY';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 提示文字
    text: {
      type: String,
      value: '别走丢了哦，添加我的小程序 即可完成下一步操作！'
    },
    // 多少秒后关闭
    duration: {
      type: Number,
      value: 1800
    },
    // 是否显示
  },

  /**
   * 组件的初始数据
   */
  data: {
    SHOW_TOP: false,
    SHOW_MODAL: false,

    is_add_my_mini_tip: false,
    checkIsAddedToMyMiniProgramTimer: null,
    add_my_mini_tip_text: '别走丢了哦，添加我的小程序 即可完成下一步操作！',
    addAppCallbackCount: 0,

    maxTimerCount: 40,
  },

  ready: function () {

    this.firstAddMyApp();
  },
  // 组件不在主页面时候 清楚定时器
  detached: function () {
    console.log("【组件不在主页面时候 清楚定时器】");
    clearInterval(this.data.checkIsAddedToMyMiniProgramTimer);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    firstAddMyApp: function () {
      let that = this;
      wx.checkIsAddedToMyMiniProgram({
        success: (res) => {
          console.log("【首次】检测是否已经添加到我的小程序", res);
          if (!res.added) {
            console.log("【没有添加到我的小程序】");
            that.setData({
              SHOW_TOP: true,
            });
            that.pollingCheckIsAddedToMyMiniProgram();
          }else{
            console.log("【已经添加到我的小程序】");
            that.add_iknow();
          }
        },
        fail: (err) => {
          console.error("检测是否已经添加到我的小程序", err);
          that.add_iknow();
        }
      })
    },
    // 开始轮询见检查是否已经添加到我的小程序
    pollingCheckIsAddedToMyMiniProgram() {
      let that = this;
      // 检查是否有 第二个定时器
      if (this.data.checkIsAddedToMyMiniProgramTimer) {
        console.log("已经有第二个定时器了");
        return;
      }
      let _timer = setInterval(() => {
        that.data.maxTimerCount--;
        if (that.data.maxTimerCount <= 0) {
          // 如果超时 就算做 已经添加到我的小程序去
          console.log("【轮询检查是否已经添加到我的小程序】定时器已经超时");
          clearInterval(that.data.checkIsAddedToMyMiniProgramTimer);
          that.setData({
            checkIsAddedToMyMiniProgramTimer: null,
            SHOW_TOP: false,
          });
          that.add_iknow();
          return;
        }
        wx.checkIsAddedToMyMiniProgram({
          success: (res) => {
            console.log("检测是否已经添加到我的小程序", res);
            that.setData({
              is_add_my_mini_tip: res.added,
            });
            if (res.added) {
              // 如果已经添加到我的小程序 则清除定时器
              clearInterval(that.data.checkIsAddedToMyMiniProgramTimer);
              // 同时 执行 成功的回调  目前回调 暂时先不注册 等到后期需要整合的时候再去注册
              that.setData({
                addAppCallbackCount: 1
              });
              if (that.data.addAppCallbackCount == 1) {
                that.setData({
                  SHOW_TOP: false,
                  SHOW_MODAL: true
                });
              }
              that.setData({
                checkIsAddedToMyMiniProgramTimer: null,
              });
            } else {
              // 如果没有添加到我的小程序 去弹出 提醒
            }
          },
          fail: (err) => {
            console.error("检测是否已经添加到我的小程序", err);
            that.setData({
              SHOW_TOP: false,
            });
          }
        })
      }, 1500);
      this.setData({
        checkIsAddedToMyMiniProgramTimer: _timer,
      });
    },

    // 显示全屏添加说明
    showModal: function () {
      this.setData({
        SHOW_TOP: false,
        SHOW_MODAL: true
      });
    },
    add_iknow: function () {
      // 发送 addMyAppIKnow 事件给父组件
      this.triggerEvent('addMyAppIKnow');
    },
    okHandler: function () {
      return;
      this.setData({
        SHOW_MODAL: false
      });
      wx.setStorage({
        key: STORAGE_KEY,
        data: +new Date,
      });
    },
    // 引用页面主动清楚定时器
    clearPollingCheckIsAddedToMyMiniProgram: function () {
      clearInterval(this.data.checkIsAddedToMyMiniProgramTimer);
    }
  }
})
