// pages/indexpicture/index.js
const app = getApp();
Page({

  /**                  
   * 页面的初始数据
   */
  data: { 
    scale:false,
    selectPicturPath:"/images/bg/bg_translate.jpg",
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
        id:"0",
        fromText:"少壮不努力老大徒伤悲少壮不努力老大徒伤悲少壮不努力老大徒伤悲少壮不努力老大徒伤悲",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"1",
        fromText:"一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"少壮不努力老大徒伤悲",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"少壮不努力老大徒伤悲",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"少壮不努力老大徒伤悲",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"少壮不努力老大徒伤悲",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"少壮不努力老大徒伤悲",
        toText:"shaoxiaolijialaodahui",
      },
      {
        id:"2",
        fromText:"一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金一寸光阴一寸金",
        toText:"shaoxiaolijialaodahui",
      },
    ]
  },

  // 页面切换
  selectFunction(e) {
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn(index,  actype, this.data.actype ); 
    this.showActionBox(actype);
}, 
showActionBox(actype){  
  let show = this.data.action?false:true;
  if(actype===0){
    console.log("actype====0");  
    show=false;
  }
  if(actype==10){
    console.log("actype===10");
    show=true;
    this.getPictureInfo()
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
    scale:show?true:false
    })
},
getPictureInfo(){
  let pictureInfo = app.request("/api/translate/photo", { 
    "source": "auto", //来源语音
      "target": "en", //目标语言
      "url": "https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg"  
    }, "POST"); 
    pictureInfo.then((res)=>{
        console.warn("getPictureInfo",res)
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      nbTitle: '图片翻译',
      nbLoading: false,
      nbFrontColor: '#ffffff',
      nbBackgroundColor: '#000000',
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