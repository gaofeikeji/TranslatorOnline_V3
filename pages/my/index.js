var app = getApp();
// pages/my/my.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbarWidthStatus: app.globalData.navbarWidthStatus, //导航栏+状态栏
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuHeight: app.globalData.menuHeight, //导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度 
    screenHeight: 0,       // 可视区域高度
    salary: null,
    true: false,
    hasUserInfo: true,
    nickName: "",
    userInfo: {},
    // showDialog: false,
    is_showTodo:1,
    selected: 2,
    // 会员信息
    subscribe: app.globalData.subscribe || {},
  },
  onLoad(options) {   
    this.payComponent = this.selectComponent("#pay");
    if(getApp().globalData.access_token){
      this.setData({ subscribe: getApp().globalData.subscribe || {} });
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }else{
      getApp().userCenterLoginCallbackSubscribe = () => {
        this.setData({ subscribe: getApp().globalData.subscribe || {} });
        this.setData({
          userInfo: app.globalData.userInfo,
        })
      }
    }
  },
  onReady() {},
  onShow() {
    this.getGift();

    this.setData({
      userInfo: app.globalData.userInfo,
    });
    // if (typeof this.getTabBar === 'function' && this.getTabBar()) {
    //   this.getTabBar().setData({
    //     selected: 1
    //   })
    // }
    
  },
  openVip: function () {
    this.payComponent.process(() => {
      console.log("success");
      wx.showModal({ content: '恭喜您，开通会员成功！', })
      app.userCenterLoginCallbackUserMember = () => {
        this.setData({
          subscribe: app.globalData.subscribe || {},
        });
      },
      app.userCenterLogin();
    }, () => {
      console.log("fail");
    });
  },
  getGift() {
    console.log("getGift");
    app.userCenterLoginCallbackUserMember = () => {
      this.setData({
        subscribe: app.globalData.subscribe || {},
      });
    },
    app.userCenterLogin();
  },

  userEdit: function () {
    wx.navigateTo({
      url: "../userinfo/index?type=update",
    });
  }, 
   //打开使用说明
  ToInstructions() {
    wx.navigateTo({
      url: "../introduce/introduce",
    })
  }, 
  moreTools: function() {
    wx.navigateTo({
      url: '../recommend/index',
    })
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
