// pages/texttranslate/index.js
import * as xy from "../../utils/common.js";
const app = getApp();
const sys = wx.getSystemInfoSync();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuBotton: app.globalData.menuBotton, //导航栏距离顶部距离
    menuRight: app.globalData.menuRight, //导航栏距离右侧距离
    menuHeight: app.globalData.menuHeight, //导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度  
    see:false,
    fromText:"",
    toText:"",
    fromList:[],//原文段落
    langList:[],//译文段落
    focus:false,
    action:false,
    currentSelectItem:0,
    showType:63,//当前原文译文的视图排版
    actype:10,//10逐行对比左右布局,11，逐行对比垂直布局; 20复制内容，30导出文件，40显示结果，41隐藏
    //底部功能区域
    list: [
      {
        "iconPath": "/images/icon/tabback.png",
        "selectedIconPath": "/images/icon/tabback.png",
        "text": "返回编辑",
        "actype": 10,
        "type":0
      },
      {
        "iconPath": "/images/icon/tabcopy.png",
        "selectedIconPath": "/images/icon/tabcopy.png",
        "text": "复制内容",
        "actype": 20,
        "type":0
      },
      {
        "iconPath": "/images/icon/tabexport.png",
        "selectedIconPath": "/images/icon/tabexport.png",
        "text": "导出文件",  
        "actype": 30,
        "type":0
      },
      {
        "iconPath": "/images/icon/zuoyou.png",
        "selectedIconPath": "/images/icon/zuoyou.png",
        "text": "左右对比",  
        "actype": 40,
        "type":0
      },                                                                                       
    ],  
    istranslate:true,  
    scale:1, 

  },

// 文本具体操作
translateFunction(e) {   
  const { index, actype } = e.currentTarget.dataset;
  let showType = null; 
    if(actype==51){//仅复制原文
      this.copyOriginal();
    }else if(actype==52){//仅复制翻译结果
      this.copyTranslate();
    }else if(actype==53){//复制原和结果
       this.copyBoth();                 
    }else{   
      console.warn("translateFunction:",e);             
    } 
    // 是否切换当前显示模板
    if(showType){ 
      this.setData({
        showType: showType,
        })
    }
},  

//初始化图片信息
initialImgText(){ 
  let originText=this.data.fromText;
  let translateText="";  
  let langList = this.data.toText;
  langList=langList.split("\n")||[];
  // langList.forEach((item,index)=>{
  //   console.log("item,index:",item,index)
  //   originText+=item.single_str_utf8+"\n";
  //   translateText+=item.translate+"\n";
  // })
  return {
    fromList:originText.split("\n")||[],
    langList:langList,
    originText:originText,
    translateText:this.data.toText
  };
},
  // 复制原文
  copyOriginal(){
    const imgText = this.initialImgText();
    console.log("copyOriginal:",imgText)
    xy.setClipboardData(imgText.originText);
    this.showActionBox(0);
  },
  // 仅复制翻译结果
  copyTranslate(){
    const imgText = this.initialImgText();
    console.log("copyOriginal:",imgText)
    xy.setClipboardData(imgText.translateText);
    this.showActionBox(0);
  },
  // 复制原文和结果
  copyBoth(){
    const imgText = this.initialImgText();
    console.log("copyOriginal:",imgText)
    xy.setClipboardData("原文:\n"+imgText.originText + "\n译文:\n"+ imgText.translateText);   
    this.showActionBox(0);
  },
  
  // Tab切换 
  selectFunction(e) {
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn(index,  actype, this.data.actype ); 
    this.showActionBox(actype);
}, 
// 底部导航以及功能切换
showActionBox(actype){  
  let show = this.data.action?false:true;
  const tThis=this;  
  if(actype===0){
    show=false;
  }
  // 返回编辑
  if(actype==10){
    wx.navigateBack({
      delta: 1,
    }); 
    return false;
  }else if(actype==20){
    console.log("actype====2");
    wx.showActionSheet({
      itemList: ["仅复制原文", "仅复制翻译结果", "复制原文和结果"],
      success: (e) => { 
        if(e.tapIndex==0){//仅复制原文
          tThis.copyOriginal();
        }else if(e.tapIndex==1){//仅复制翻译结果
          tThis.copyTranslate();
        }else if(e.tapIndex==2){//复制原和结果
          tThis.copyBoth();                 
        }
      },
      fail: (err) => {
        wx.showToast({ title: err, icon: "none" });
      },
    });
    return false;
  }else if(actype==30){
    console.log("actype====3"); 
    wx.showActionSheet({
      itemList: ["导出TXT文件", "导出Word文档", "导出Excel文档"],
      success: (e) => {  
        if(e.tapIndex==0){//导出TXT文件
      
          const currentTxt = tThis.initialImgText();
          console.log("actype::",currentTxt)
            if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
              app.showModalClose("开始下载文件……",3000);
              app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-txt","中英文线上拍照翻译器翻译的纯文本文档.txt");
            }else{
              app.showModalClose("转换的内容为空……",1000);
              return false;
            }
         }else if(e.tapIndex==1){//导出Word文档
          const currentTxt = tThis.initialImgText();
          console.log("actype::",currentTxt)
            if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
              app.showModalClose("开始下载文件……",3000);
              app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-word","中英文线上拍照翻译器翻译的Word文档.docx");
            }else{
              app.showModalClose("转换的内容为空……",1000);
              return false;
            }
          }else if(e.tapIndex==2){//导出Excel文档
            const currentTxt = tThis.initialImgText();
            console.log("actype::",currentTxt)
              if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
                app.showModalClose("开始下载文件……",3000);
                app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-excel","中英文线上拍照翻译器翻译的Excel文档.excel");
              }else{
                app.showModalClose("转换的内容为空……",1000);
                return false;
              }
          }
      },
      fail: (err) => {
        wx.showToast({ title: err, icon: "none" });
      },
    });
    return false;
    show=true;
  }else if(actype==40){
    console.log("actype====3");
    show=false;
    wx.showActionSheet({
      itemList: ["逐行对比显示", "左右对比显示", "仅显示译文"],
      success: (e) => { 
        let showType = null; 
        if(e.tapIndex==0){//逐行对比显示
          showType=61;
        }else if(e.tapIndex==1){//左右对比显示
          showType=62;
        }else if(e.tapIndex==2){//仅显示译文
          showType=63;        
        }
            
        if(showType){ 
          this.setData({
            showType: showType,
            })
        }
 
      },
      fail: (err) => {
        wx.showToast({ title: err, icon: "none" });
      },
    }); 
  }else{
    console.error("actype====未记录",actype); 
  }
  console.warn("actypeactype:",  actype );   
  this.setData({
    actype: actype,
    action:show,
    see:show?true:false,
    scale:actype==0?(this.data.scale<0.5?0.3:0.8):1//需要添加缩放比例记录，或者采用图片等比设置，
    })
},
toTranslateText(){
  const tThis = this;
  const fromText = this.data.fromText;
  if(fromText.length<1){
    wx.showLoading({ title: "翻译内容不能为空...", mask: true });
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    return false;
  }  
  wx.showLoading({ title: "正在翻译中……...", mask: true })
  xy.checkTextSync({
    content: fromText,
    successFunc: tThis.translateUpdate,
    failFunc: (err) => {
      xy.showTip(err.msg);
    },
  });
},

  // 翻译
  translateUpdate: function () { 
    wx.showLoading({ title: "翻译中……", mask: true });
    const fromText = this.data.fromText;
    wx.request({
      url: app.globalData.globalHost + "/api/translate/text",
      method: "POST",
      header: {
        "content-type": "application/json",
        Authorization: wx.getStorageSync("access_token"),
        "x-device-brand": sys.brand || "unknown",
        // 当前 页面栈 最后一个页面的路径
        "x-device-path": getCurrentPages()[getCurrentPages().length - 1].route,
        "x-device-model": sys.model || "unknown",
        "x-device-system": sys.system || "unknown",
        "x-device-network": getApp().globalData.currentNetwork || "unknown",
      },
      data: {
        text: fromText,
        target: wx.getStorageSync("currentTargetLang")||"zh",
        source: wx.getStorageSync("currentLang")||"auto",
      },
      success: (res) => {
        if (res.data.code == 1) {
          // 把翻译结果传到下一个页面 使用全局变量  
        this.setData({
          toText: res.data.data.TargetText,
          action_info:res.data.data.action_info, 
        }) 
       const textObj= this.initialImgText();
       console.warn("initialImgText:::",textObj);
        this.setData({
          fromList:textObj.fromList,
          langList:textObj.langList,
          })
          setTimeout(() => {
            wx.hideLoading();
            // wx.navigateTo({
            //   url: "/pages/result/index",
            // });
          }, 1000);
        } else {
          wx.showToast({ title: "暂不支持", icon: "error" });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) { 
    this.setData({
      fromText:options.text||""
    })
     
    const tThis=this; 
    app.globalLogin(this,function(data,capp){ 
      tThis.setData({
        subscribe: capp.globalData.subscribe || {},
        maxlength: capp.globalData.subscribe.is_vip ? 2000 : 200,
        notVip: !capp.globalData.subscribe.is_vip
      })
      tThis.toTranslateText(); 
    });
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