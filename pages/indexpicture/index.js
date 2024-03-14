// pages/indexpicture/index.js
import * as xy from "../../utils/common.js";
const app = getApp();
Page({ 
  /**                  
   * 页面的初始数据
   */
  data: { 
    see:false,
    selectPicturPath:app.globalData.selectPicturPath,
    action:false,
    actype:10,//10逐行对比左右布局,11，逐行对比垂直布局; 20复制内容，30导出文件，40显示结果，41隐藏
    //底部功能区域
    list: [
      {
        "iconPath": "/images/nav/duibi.png",
        "selectedIconPath": "/images/nav/duibi.png",
        "text": "逐行对比",
        "actype": 10,
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
      "single_str_utf8": "LUENCE",
      "single_rate": 0.9405303,
      "left": 52.647438,
      "top": 18.7191887,
      "right": 121.645035,
      "bottom": 40.2459221,
      "translate": "LUENCE"
    }],
    istranslate:true,  
    scale:1, 
    selectPicturWidth: 500, 
    selectPicturHeight: 600,
    currentSelectItem:"",
    currentSelectX:0,
    currentSelectY:0,
  }, 
  // 页面切换 
  selectFunction(e) {
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn(index,  actype, this.data.actype ); 
    this.showActionBox(actype);
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
// 底部导航以及功能切换
showActionBox(actype){  
  let show = this.data.action?false:true;
  if(actype===0){
    console.log("actype====0");  
    show=false;
  }
  if(actype==10){
    console.log("actype===10");
    show=true;
  }else if(actype==11){
    console.log("actype===11");
    show=true;
  }else if(actype==20){
    console.log("actype====2");
  }else if(actype==30){
    console.log("actype====3");
  }
  console.warn("actypeactype:",  actype );   
  this.setData({
    actype: actype,
    action:show,
    see:show?true:false,
    scale:actype==0?0.2:0.5//需要添加缩放比例记录，或者采用图片等比设置，
    })
},
// 图片具体文字内容识别
getPictureInfo(picUrl){
//  picUrl="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg";
  const tThis=this;
  let pictureInfo = app.request("/api/translate/photo", { 
    "source": "auto", //来源语音
      "target": "en", //目标语言
      "url": picUrl  
    }, "POST"); 
    pictureInfo.then((res)=>{
        console.warn("getPictureInfo",res.data)

        tThis.setData({
          langList: res.data 
          })
    })
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
    this.setData({
      nbTitle: '图片解析',
      nbLoading: false,
      nbFrontColor: '#ffffff',
      nbBackgroundColor: '#000000',
    })
    const tThis=this;
    // app.globalLogin();
    // xy.showTip("服务器正在解析资源");
    wx.showLoading({ title: "服务器正在解析资源...", mask: true });
    wx.getImageInfo({
      src: app.globalData.selectPicturPath,
      success (res) {
        // tThis.getPictureRate(res);
        
        const sysInfo= wx.getSystemInfoSync()
        const windowWidth =sysInfo.windowWidth
        console.warn("sysInfo:",sysInfo)
        console.warn("picpic:",res)
        console.log("getImageInfo:",res)
        let scale=0.9;
        if(res.width>windowWidth){
          scale=windowWidth/res.width-0.05;
          console.warn("picpic-rate:",scale)  
        }
        tThis.setData({ 
          selectPicturWidth: res.width, 
          selectPicturHeight: res.height, 
          selectPicturPath: app.globalData.selectPicturPath,
          scale: scale
        });
        console.log("app.globalData.selectPicturPath：",tThis.data.selectPicturPath,app.globalData.selectPicturPath)
        tThis.getPictureInfo(tThis.data.selectPicturPath)
        
        wx.hideLoading();
       
      }
    })
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