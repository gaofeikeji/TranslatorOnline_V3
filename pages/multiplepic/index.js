// pages/text/index.js
import * as xy from "../../utils/common.js";
const sys = wx.getSystemInfoSync();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notVip: false,  

    maxlength: 2000,
    isIOS: sys.system.indexOf('iOS') > -1,
    subscribe: app.globalData.subscribe || {},
    imgList:[{
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/1.jpeg",
      nickName: "哄哄哄"
    }, {
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/2.jpeg",
      nickName: "神经蛙"
    }, {
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/3.jpeg",
      nickName: "阿白白"
    }, {
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/4.jpeg",
      nickName: "momo"
    }, {
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/5.jpeg",
      nickName: "欢乐马"
    }]
  },

  OnClickVipLock() {
    this.payComponent.process(() => {
      app.userCenterLoginCallbackOnClickVipLock = () => {
        this.setData({
          subscribe: app.globalData.subscribe || {},
          maxlength: app.globalData.subscribe.is_vip ? 2000 : 200,
        });
      }
      app.userCenterLogin();
    }, () => { });
  },
  // 粘贴和清空 
  textFun(e) {
    const tThis=this;
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn("textFun", actype); 
    if(actype==3){//清空剪贴板
      xy.setClipboardData("");
      tThis.setData({           
        fromText:""
      })
    }else if(actype=="1"){//粘贴内容
      const resp = xy.getClipboardData();
      resp.then(function(rep){ 
        tThis.setData({           
          fromText:rep.data
        })
      });
    }else if(actype=="2"){//确认翻译
      const resp = tThis.data.fromText;
      console.warn("fromText::",
      resp,wx.getStorageSync("currentTargetLang"), wx.getStorageSync("currentLang")); 
      if(resp!=""){ 
        wx.navigateTo({
          url: "/pages/texttranslate/index?text="+resp
        })
      }else{
        app.showModalClose("请填写要翻译的内容",3000);
      }
    }
    // this.setData({
    //   currentSelectY: top, 
    //   scale:1
    //   })
}, 
// 监听输入框改变
updateFormText(e){
  this.setData({
    fromText: e.detail.value,
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(){ 
    // 注册pay组件
    this.payComponent = this.selectComponent("#pay");
    app.getCurrentLang(this); 
    // xy.setClipboardData("少小离家老大回人之初性本善");
  },   
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (app.globalData.access_token) {
      this.setData({
        subscribe: app.globalData.subscribe || {},
        maxlength: app.globalData.subscribe.is_vip ? 2000 : 200,
        notVip: !app.globalData.subscribe.is_vip
      })
    } else {
      app.userCenterLoginCallbackIndex = () => {
        this.setData({
          subscribe: app.globalData.subscribe || {},
          maxlength: app.globalData.subscribe.is_vip ? 2000 : 200,
          notVip: !app.globalData.subscribe.is_vip
        })
      };
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})