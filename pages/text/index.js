// pages/text/index.js
import * as xy from "../../utils/common.js";
const sys = wx.getSystemInfoSync();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nbFrontColor: '#16724273',
    nbBackgroundColor: '#FF0DE0',
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuBotton: app.globalData.menuBotton, //导航栏距离顶部距离
    menuRight: app.globalData.menuRight, //导航栏距离右侧距离
    menuHeight: app.globalData.menuHeight, //导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度  
    notVip: false,  

    maxlength: 200,
    isIOS: sys.system.indexOf('iOS') > -1,
    subscribe: app.globalData.subscribe || {},
    fromText:"",//输入框内容
    fromTextLength:0,//输入框内容
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
      console.warn("fromText::", resp,wx.getStorageSync("currentTargetLang"), wx.getStorageSync("currentLang")); 
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
  const formdata= e.detail.value;
  if(this.data.notVip==false&&formdata.length>this.data.maxlength){
    xy.showModalClose("请充值会员享受更多服务",2000);
  }
  this.setData({
    fromText: formdata.substr(0,this.data.maxlength),
    fromTextLength: formdata.length,
    }) 
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(){ 
    // 注册pay组件
    this.payComponent = this.selectComponent("#pay");
    const tThis=this;
    app.globalLogin(this,function(data,capp){ 
      // console.warn("app.globalData.subscribe.is_vip",capp.globalData.subscribe.is_vip)
      tThis.setData({
        subscribe: capp.globalData.subscribe || {},
        maxlength: capp.globalData.subscribe.is_vip!=0 ? 2000 : 200,
        notVip: !capp.globalData.subscribe.is_vip
      })
    });
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