// pages/indexpicture/index.js
import * as xy from "../../utils/common.js";
const app = getApp();

function debounce(func, wait) {
    let timeoutId;
    return function(...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        timeoutId = null;
      }, wait);
    };
  }
Page({ 
  /**                  
   * 页面的初始数据
   */
  data: { 
    see:false,
    selectPicturPath:app.globalData.selectPicturPath,
    action:false,
    actype:10,//10逐行对比左右布局,11，逐行对比垂直布局; 20复制内容，30导出文件，40显示结果，41隐藏
    currentVisti:0,
    showResult:0,
    //底部功能区域
    list: [
      {
        "iconPath": "/images/nav/duibi.png",
        "selectedIconPath": "/images/nav/duibi.png",
        "text": "逐行对比",
        "actype": 1,
        "type":0
      },
      {
        "iconPath": "/images/copy.png",
        "selectedIconPath": "/images/nav/copy.png",
        "text": "复制内容",
        "actype": 20,
        "type":0
      },
      {
        "iconPath": "/images/nav/export.png",
        "selectedIconPath": "/images/nav/duibi.png",
        "text": "导出结果",  
        "actype": 30,
        "type":0
      },
      {
        "iconPath": "/images/nav/result.png",
        "selectedIconPath": "/images/nav/result.png",
        "text": "显示结果",  
        "selectedText":"隐藏结果",
        "actype": 40,
        "type":0
      },                                                                                       
    ],  
    // langList
    langList:[
      {
      "single_pos": {
        "pos": [{
          "x": 52.9187775,
          "y": 18.7191887
        }]
      },
      "single_str_utf8": "正在加载中…………",
      "single_rate": 0.9405303,
      "left": 52.647438,
      "top": 18.7191887,
      "right": 121.645035,
      "bottom": 40.2459221,
      "translate": "正在加载中…………"
    }],
    istranslate:true,  
    scale:1, 
    selectPicturWidth: 500, 
    selectPicturHeight: 600,
    currentSelectItem:"",
    currentSelectX:0,
    currentSelectY:0,
    lastScale: 1,
    startTouches: [],
  }, 
  // 页面切换 
  selectFunction(e) {
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn(index,  actype, this.data.actype ); 
    this.showActionBox(actype);
}, 
selectVerticle(e) {
  const { index, actype } = e.currentTarget.dataset;
  console.warn(e);  
  console.warn(index,  actype, this.data.actype ); 
  let currentVisti=0;
  if(actype==10){
    console.log("actype===10");
    currentVisti=0; 
  }else if(actype==11){
    currentVisti=1; 
  }
  this.setData({ 
    currentVisti:currentVisti, 
    })
}, 
// 文本具体操作
translateFunction(e) {
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn(index,  actype, this.data.actype ); 
    if(actype==51){//仅复制原文
      this.copyOriginal();
    }else if(actype==52){//仅复制翻译结果
      this.copyTranslate();
    }else if(actype==53){//复制原和结果
                this.copyBoth();                 
    }else if(actype==71){//导出TXT文件
      
      const currentTxt = this.initialImgText();
      console.log("actype::",currentTxt)
        if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
          app.showModalClose("开始下载文件……",3000);
          app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-txt");
        }else{
          app.showModalClose("转换的内容为空……",1000);
          return false;
        }
     }else if(actype==72){//导出Word文档
      const currentTxt = this.initialImgText();
      console.log("actype::",currentTxt)
        if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
          app.showModalClose("开始下载文件……",3000);
          app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-word");
        }else{
          app.showModalClose("转换的内容为空……",1000);
          return false;
        }
      }else if(actype==73){//导出Excel文档
        const currentTxt = this.initialImgText();
        console.log("actype::",currentTxt)
          if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
            app.showModalClose("开始下载文件……",3000);
            app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-excel");
          }else{
            app.showModalClose("转换的内容为空……",1000);
            return false;
          }
      }
}, 
  // 当前行切换 
  toImageTextItem(e) {
    const { left, top } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn(left, top); 
    this.setData({
      currentSelectY: top,
      currentSelectX: left,
      currentSelectItem: top+":"+left,
      scale:1
      })
}, 

  // 查看原图
  viewImage() {
    wx.previewImage({
      urls: [this.data.selectPicturPath],
      current: this.data.selectPicturPath,
    });
  },
// 底部导航以及功能切换
showActionBox(actype){  
  let show = this.data.action?false:true;
  let currentVisti =0;
  if(actype===0){
    console.log("actype====0");  
    show=false;
  }
  if(actype==1){
    console.log("actype===1");
  }if(actype==10){
    console.log("actype===10");
    currentVisti=0;
    show=true;
  }else if(actype==11){
    currentVisti=1;
    console.log("actype===11");
    
    show=true;
  }else if(actype==20){
    console.log("actype====2");
  }else if(actype==30){
    console.log("actype====3");
  }else if(actype==40){//显示隐藏结果
    console.log("actype====40");
    this.setData({
      actype: actype, 
      showResult: this.data.showResult==1?0:1, 
      see:false,
      scale:this.data.showResult==1?1.8:1
      })
      return false;
  }
  console.warn("actypeactype:",  actype );   
  this.setData({
    actype: actype,
    action:show, 
    see:show?true:false,
    scale:actype==0?(this.data.scale<0.5?0.8:0.9):1//需要添加缩放比例记录，或者采用图片等比设置，
    })
},
// 图片具体文字内容识别
getPictureInfo(picUrl){
//  picUrl="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg";
  const tThis=this;
  wx.showLoading({ title: "正在翻译中...", mask: true });
  const curent = app.getCurrentLang(tThis);
  console.warn("getPictureInfogetPictureInfo:",  picUrl );   
  let pictureInfo = app.request("/api/translate/photo", { 
    "source": curent.currentLang, //来源语音
      "target": curent.currentTargetLang, //目标语言 
      "url": picUrl,  
      // "url": "https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg",  
    }, "POST"); 
    pictureInfo.then((res)=>{
        console.warn("getPictureInfo",res.data)
        wx.hideLoading();

        tThis.setData({
          langList: res.data 
          })
    }).catch(err => {
      wx.hideLoading();
      // 暂时屏蔽
      // console.log('err:', err,err.indexOf("err: OCR 服务异常"))
      // if(err.indexOf("err: OCR 服务异常")==-1){
      //   app.showModalClose("当前排队的人太多，请稍后重试……",2000);
      //   setTimeout(function(){
      //     wx.navigateTo({
      //       url: '../index/index'
      //     })
      //   },2000)
      //   return false;
      // }
      tThis.setData({
        langList:[{
          "single_pos": {
            "pos": [{
              "x": 52.9187775,
              "y": 18.7191887
            }]
          },
          "single_str_utf8": err,
          "single_rate": 0.9405303,
          "left": 100,
          "top": 80,
          "right": 121.645035,
          "bottom": 40.2459221,
          "translate":err
        }]
      })
    })
    
},
linstenerScale(event){
  console.warn("linstenerScale",event)
},
//初始化图片信息
initialImgText(){ 
  let originText="";
  let translateText="";
  const langList = this.data.langList;
  langList.forEach((item,index)=>{
    console.log("item,index:",item,index)
    originText+=item.single_str_utf8+"\n";
    translateText+=item.translate+"\n";
  })
  return {
    originText:originText,
    translateText:translateText
  };
},
// 复制原文
copyOriginal(){
  const imgText = this.initialImgText();
  console.log("copyOriginal:",imgText)
  xy.setClipboardData(imgText.originText);
},
// 仅复制翻译结果
copyTranslate(){
  const imgText = this.initialImgText();
  console.log("copyOriginal:",imgText)
  xy.setClipboardData(imgText.translateText);
},
// 复制原文和结果
copyBoth(){
  const imgText = this.initialImgText();
  console.log("copyOriginal:",imgText)
  xy.setClipboardData("原文:\n"+imgText.originText + "\n译文:\n"+ imgText.translateText);   
},
 
// 辅助函数
getDistance(a, b) {
  return Math.sqrt(Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2));
},
getMidpoint(a, b) {
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
  };
},
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad(options) {  
    // app.userCenterLogin();
    this.payComponent = this.selectComponent("#pay");
    this.rateComponent = this.selectComponent("#rate");
    app.getCurrentLang(this);
    const tThis=this;
    // app.globalLogin();
    // xy.showTip("服务器正在解析资源"); 
    app.globalData.selectPicturPath=options.selectPicturPath;
    // app.globalData.selectPicturPath="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg";
    // options.selectPicturPath="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg";
    console.log("options.selectPicturPath:",options.selectPicturPath);
    this.getImageInfo(tThis,options);
  },
  getPictureRate(pic){
    const sysInfo= wx.getSystemInfoSync()
    const windowWidth =sysInfo.windowWidth
    console.warn("sysInfo:",sysInfo)
    console.warn("picpic:",pic)
    if(pic.width>windowWidth){
      console.warn("picpic-rate:",windowWidth/pic.width) 
      // scale
      // this.setData({ 
      //   scale: windowWidth/pic.width,  
      // });
    }
    return {
      width:0,
      height:0
    }
  },
  getImageInfo(tThis,options){
    if(!options.selectPicturPath){
      app.showModalClose("非法操作,图片不存在",2000);
      setTimeout(function(){
        wx.navigateTo({
          url: '../index/index'
        })
      },2000)
      return false;
    }
    wx.getImageInfo({
      src: options.selectPicturPath,
      success (res) {
        // tThis.getPictureRate(res);
        
        const sysInfo= wx.getSystemInfoSync()
        const windowWidth =sysInfo.windowWidth
        console.warn("sysInfo:",sysInfo) 
        console.log("getImageInfo:",res)
        let scale=1;
        const upload_pic_info= wx.getStorageSync('upload_pic_info') 
        if(res.width>windowWidth){
          scale=windowWidth/res.width-0.05;
          console.warn("picpic-rate:",scale)  
        }else{
          console.warn("picpic-upload_pic_info:",upload_pic_info)  
          if(upload_pic_info.width/res.width>2){
            scale=1.2;//upload_pic_info.width/res.width-0.6;
          }
        }
        tThis.setData({ 
          selectPicturWidth: res.width, 
          selectPicturHeight: res.height, 
          // selectPicturWidth: upload_pic_info.width/res.width>2?upload_pic_info.width:res.width, 
          // selectPicturHeight: upload_pic_info.width/res.width>2?upload_pic_info.height:res.height, 
          selectPicturPath: options.selectPicturPath,
          scale: scale
        });
        console.log("app.globalData.selectPicturPath：",tThis.data.selectPicturPath,app.globalData.selectPicturPath)
        tThis.getPictureInfo(options.selectPicturPath)
       
      }
    })
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
      console.log('app.globalData.subscribe.is_vip', app.globalData.subscribe)
      this.setData({
        notVip: !app.globalData.subscribe.is_vip
      })
    } else {
      app.userCenterLoginCallbackIndex = () => {
        console.log('app.globalData.subscribe.is_vip', app.globalData.subscribe)
        this.setData({
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

  },  
  handleTouchStart: function(e) {
    // 记录起始触点
    this.setData({
      startTouches: e.touches
    });
  },
  
  handleTouchMove: debounce(function(e) {
    const touches = e.touches;
    const changeX = touches[0].clientX - this.data.startTouches[0].clientX;
    const changeY = touches[0].clientY - this.data.startTouches[0].clientY;
    
    // 只有在最后一次 touchmove 后才会执行这个函数体
    this.setData({
      movableX: this.data.movableX + changeX,
      movableY: this.data.movableY + changeY
    });
  }, 100),

  handleTouchEnd: function(e) {
    // 可在此处重置初始触点
    this.setData({
      startTouches: []
    });
  },

  handlePinch: function(e) {
    // 处理捏合事件，实现缩放功能
    const scale = e.detail.scale / this.data.lastScale;
    this.setData({
      scale: this.data.scale * scale,
      lastScale: e.detail.scale
    });
  }
})