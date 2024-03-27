// pages/text/index.js
import * as xy from "../../utils/common.js";
const sys = wx.getSystemInfoSync();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: { 
    navbarWidthStatus: app.globalData.navbarWidthStatus, //导航栏+状态栏
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuBotton: app.globalData.menuBotton, //导航栏距离顶部距离
    menuRight: app.globalData.menuRight, //导航栏距离右侧距离
    menuHeight: app.globalData.menuHeight, //导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度  
    notVip: false,  

    maxlength: 2000,
    isIOS: sys.system.indexOf('iOS') > -1,
    subscribe: app.globalData.subscribe || {},
    fromText:"",//输入框内容
    fromTextLength:0,//输入框内容 
    toText:"",
    currentSTate:1,
    
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
  // 注册会员
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
    //console.warn("textFun", actype); 
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
      //console.warn("fromText::", resp,wx.getStorageSync("currentTargetLang"), wx.getStorageSync("currentLang")); 
      if(resp!=""){ 
        xy.checkTextSync({
          content: resp,
          successFunc: function(){ 
            tThis.translateUpdate();
            // wx.navigateTo({
            //   url: "/pages/texttranslate/index?text="+resp
            // })
          },
          failFunc: (err) => {
            xy.showTip(err.msg);
          },
        });
       
      }else{ 
        wx.showModal({
          title: '提示',
          showCancel:false,
          content: '请填写要翻译的内容，您当前什么都没有填写',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
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
  // console.warn(this.data.notVip,formdata.length)
  if(this.data.notVip==false&&formdata.length==this.data.maxlength){
   wx.showModal({
     title: '温馨提醒',
     showCancel:false,
     content: '普通用户享受2000字，请充值会员享受更多服务',
     complete: (res) => {
       if (res.cancel) {
       }
       if (res.confirm) {
       }
     }
   })
  }
  this.setData({
    fromText: formdata.substr(0,this.data.maxlength),
    fromTextLength: formdata.length,
    }) 
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){ 
    // 注册pay组件
    this.payComponent = this.selectComponent("#pay");
    const tThis=this;
    if(options.text){
      tThis.setData({
        fromText: options.text,
      })
    }
    app.globalLogin(this,function(data,capp){ 
      // //console.warn("app.globalData.subscribe.is_vip",capp.globalData.subscribe.is_vip)
      tThis.setData({
        subscribe: capp.globalData.subscribe || {},
        maxlength: capp.globalData.subscribe.is_vip!=0 ? 2000 : 2000,
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
    }else if(actype==61){//仅复制原文
      showType=61;
    }else if(actype==62){//仅复制翻译结果
      showType=62;
    }else if(actype==63){//复制原和结果
      showType=63;            
    }  else if(actype==71){//导出TXT文件
      
          const currentTxt = this.initialImgText();
            if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
              app.showModalClose("开始下载文件……",3000);
              app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-txt","中英文线上拍照翻译器翻译的纯文本文档.txt");
            }else{
              app.showModalClose("转换的内容为空……",1000);
              return false;
            }
         }else if(actype==72){//导出Word文档
          const currentTxt = this.initialImgText();
            if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
              app.showModalClose("开始下载文件……",3000);
              app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-word","中英文线上拍照翻译器翻译的Word文档.docx");
            }else{
              app.showModalClose("转换的内容为空……",1000);
              return false;
            }
          }else if(actype==73){//导出Excel文档
            const currentTxt = this.initialImgText();
              if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
                app.showModalClose("开始下载文件……",3000);
                app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-excel","中英文线上拍照翻译器翻译的Excel文档.excel");
              }else{
                app.showModalClose("转换的内容为空……",1000);
                return false;
              }
          }else{   
      //console.warn("translateFunction:",e);             
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
    xy.setClipboardData(imgText.originText);
    this.showActionBox(0);
  },
  // 仅复制翻译结果
  copyTranslate(){
    const imgText = this.initialImgText();
    // console.log("copyOriginal:",imgText)
    xy.setClipboardData(imgText.translateText);
    this.showActionBox(0);
  },
  // 复制原文和结果
  copyBoth(){
    const imgText = this.initialImgText();
    // console.log("copyOriginal:",imgText)
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
  // let show = this.data.action?false:true;
  let show = this.data.action?(this.data.actype==actype?false:true):true;
  const tThis=this;  
  if(actype===0){
    show=false;
  }
  // 返回编辑
  if(actype==10){
    // wx.navigateTo({
    //   url: "/pages/text/index?text="+tThis.data.fromText
    // })
    tThis.setData({
      currentSTate:1
    });
    // wx.navigateBack({
    //   delta: 1,
    // });     
    return false;
  }else if(actype==20){
    // wx.showActionSheet({
    //   itemList: ["仅复制原文", "仅复制翻译结果", "复制原文和结果"],
    //   success: (e) => { 
    //     if(e.tapIndex==0){//仅复制原文
    //       tThis.copyOriginal();
    //     }else if(e.tapIndex==1){//仅复制翻译结果
    //       tThis.copyTranslate();
    //     }else if(e.tapIndex==2){//复制原和结果
    //       tThis.copyBoth();                 
    //     }
    //   },
    //   fail: (err) => {
    //     wx.showToast({ title: err, icon: "none" });
    //   },
    // });
    // return false;
  }else if(actype==30){
    // wx.showActionSheet({
    //   itemList: ["导出TXT文件", "导出Word文档", "导出Excel文档"],
    //   success: (e) => {  
    //     if(e.tapIndex==0){//导出TXT文件
      
    //       const currentTxt = tThis.initialImgText();
    //       console.log("actype::",currentTxt)
    //         if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
    //           app.showModalClose("开始下载文件……",3000);
    //           app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-txt","中英文线上拍照翻译器翻译的纯文本文档.txt");
    //         }else{
    //           app.showModalClose("转换的内容为空……",1000);
    //           return false;
    //         }
    //      }else if(e.tapIndex==1){//导出Word文档
    //       const currentTxt = tThis.initialImgText();
    //       console.log("actype::",currentTxt)
    //         if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
    //           app.showModalClose("开始下载文件……",3000);
    //           app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-word","中英文线上拍照翻译器翻译的Word文档.docx");
    //         }else{
    //           app.showModalClose("转换的内容为空……",1000);
    //           return false;
    //         }
    //       }else if(e.tapIndex==2){//导出Excel文档
    //         const currentTxt = tThis.initialImgText();
    //         console.log("actype::",currentTxt)
    //           if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
    //             app.showModalClose("开始下载文件……",3000);
    //             app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-excel","中英文线上拍照翻译器翻译的Excel文档.excel");
    //           }else{
    //             app.showModalClose("转换的内容为空……",1000);
    //             return false;
    //           }
    //       }
    //   },
    //   fail: (err) => {
    //     wx.showToast({ title: err, icon: "none" });
    //   },
    // });
    // return false;
    show=true;
  }else if(actype==40){
    show=true;
    // wx.showActionSheet({
    //   itemList: ["逐行对比显示", "左右对比显示", "仅显示译文"],
    //   success: (e) => { 
    //     let showType = null; 
    //     if(e.tapIndex==0){//逐行对比显示
    //       showType=61;
    //     }else if(e.tapIndex==1){//左右对比显示
    //       showType=62;
    //     }else if(e.tapIndex==2){//仅显示译文
    //       showType=63;        
    //     }
            
    //     if(showType){ 
    //       this.setData({
    //         showType: showType,
    //         })
    //     }
 
    //   },
    //   fail: (err) => {
    //     wx.showToast({ title: err, icon: "none" });
    //   },
    // }); 
  }else{
    console.error("actype====未记录",actype); 
  }
  //console.warn("actypeactype:",  actype );   
  this.setData({
    actype: actype,
    action:show,
    see:show?true:false,
    scale:actype==0?(this.data.scale<0.5?0.3:0.8):1//需要添加缩放比例记录，或者采用图片等比设置，
    })
},
// 子组件回调语言改变
listenLanguge(){
  if(this.data.currentSTate==1){
    return false;
  }else{ 
  this.toTranslateText();
  }
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
    const tThis=this;
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
          tThis.setData({
          toText: res.data.data.TargetText,
          action_info:res.data.data.action_info, 
          currentSTate:2,
        }) 
       const textObj= tThis.initialImgText();
       //console.warn("initialImgText:::",textObj);
       tThis.setData({
          fromList:textObj.fromList,
          langList:textObj.langList,
          currentSTate:2,
          });
          setTimeout(() => {
            wx.hideLoading(); 
          }, 1000);
        } else {
          wx.showToast({ title: "暂不支持", icon: "error" });
        }
      },
      fail: (err) => {
        console.log(err);
       tThis.setData({ 
          currentSTate:1,
          })
        wx.showToast({ title: "翻译失败，请稍后重试", icon: "error" });
      },
    });
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