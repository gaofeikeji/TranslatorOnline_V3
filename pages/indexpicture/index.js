// pages/indexpicture/index.js
import * as xy from "../../utils/common.js";
const app = getApp();
 
Page({ 
  /**                  
   * 页面的初始数据
   */
  data: { 
    navbarWidthStatus: app.globalData.navbarWidthStatus, //导航栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度  
    screenWidth: app.globalData.screenWidth , //可视区域高度  
    notVip:false,
    see:false,
    selectPicturPath:app.globalData.selectPicturPath,
    action:false,
    actype:10,//10逐行对比左右布局,11，逐行对比垂直布局; 20复制内容，30导出文件，40显示结果，41隐藏
    currentVisti:0,
    showResult:1,
    oldfromLang:"",
    oldtoLang:"",
    options:{},
    //底部功能区域
    list: [
      {
        "iconPath": "/images/zhuohangduibi.png",
        "selectedIconPath": "/images/zhuohangduibi.png",
        "text": "逐行对比",
        "actype": 1,
        "type":0
      },
      {
        "iconPath": "/images/copy.png",
        "selectedIconPath": "/images/copy.png",
        "text": "复制内容",
        "actype": 20,
        "type":0
      },
      {
        "iconPath": "/images/export.png",
        "selectedIconPath": "/images/export.png",
        "text": "导出结果",  
        "actype": 30,
        "type":0
      },
      {
        "iconPath": "/images/showresult.png",
        "selectedIconPath": "/images/hideresult.png",
        "text": "显示结果",  
        "selectedText":"隐藏结果",
        "actype": 40,
        "type":0
      },                                                                                       
    ],  
    // langList
    langList:[
    //   {
    //   selectPicturWidth:"",
    //   selectPicturHeight:"",
    //   selectPicturPath:"",
    //   list:[
    //     {
    //     "single_pos": {
    //       "pos": [{
    //         "x": 52.9187775,
    //         "y": 18.7191887
    //       }]
    //     },
    //     "single_str_utf8": "正在加载中…………",
    //     "single_rate": 0.9405303,
    //     "left": 52.647438,
    //     "top": 18.7191887,
    //     "right": 121.645035,
    //     "bottom": 40.2459221,
    //     "translate": "正在加载中…………"
    //   }]
    // }
  ],
    istranslate:true,  
    scale:1, 
    ccWidth:0,
    ccHeight:0,
    selectPicturWidth: 500, 
    selectPicturHeight: 600,
    currentSelectItem:"",
    currentSelectX:20,
    currentSelectY:40,
    screenWidth:app.globalData.screenWidth,
    lastScale: 1,
    toBase64_url: "",
    scene: "template_unlock_image",
    startTouches: [],
  }, 
  // 页面切换 
  selectFunction(e) {
    const { index, actype } = e.currentTarget.dataset;
    //console.warn(index,  actype, this.data.actype ); 
    this.showActionBox(actype);
}, 
handleLongPress(e) {
  //console.warn("handleLongPress",e);  
},
handleTouchEnd(e) {
  //console.warn("handleTouchEnd",e);   
},
handleTouchMove(e) {
  //console.warn("handleTouchMove",e);   
},
selectVerticle(e) {
  const { index, actype } = e.currentTarget.dataset;
  //console.warn(index,  actype, this.data.actype ); 
  let currentVisti=0;
  if(actype==10){
    //console.log("actype===10");
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
    //console.warn(e);  
    //console.warn(index,  actype, this.data.actype ); 
    if(actype==51){//仅复制原文
      this.copyOriginal();
    }else if(actype==52){//仅复制翻译结果
      this.copyTranslate();
    }else if(actype==53){//复制原和结果
                this.copyBoth();                 
    }else if(actype==71){//导出TXT文件
      
      const currentTxt = this.initialImgText();
      //console.log("actype::currentTxtcurrentTxt",currentTxt)
        if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
          app.showModalClose("开始下载文件……",3000);
          app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-txt","中英文线上拍照翻译器翻译的纯文本文档.txt");
        }else{
          app.showModalClose("转换的内容为空……",1000);
          return false;
        }
     }else if(actype==72){//导出Word文档
      const currentTxt = this.initialImgText();
      //console.log("actype::",currentTxt)
        if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
          app.showModalClose("开始下载文件……",3000);
          app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-word","中英文线上拍照翻译器翻译的Word文档.docx");
        }else{
          app.showModalClose("转换的内容为空……",1000);
          return false;
        }
      }else if(actype==73){//导出Excel文档
        const currentTxt = this.initialImgText();
        //console.log("actype::",currentTxt)
          if(currentTxt.translateText&&currentTxt.translateText.length>0){ 
            app.showModalClose("开始下载文件……",3000);
            app.dowloadFile(currentTxt.translateText,"/api/tools/text-to-excel","中英文线上拍照翻译器翻译的Excel文档.excel");
          }else{
            app.showModalClose("转换的内容为空……",1000);
            return false;
          }
      }
}, 
//点击图片显示对应视图的段落
toVerticleHorizonTextItem(e){
  const { left, top ,index,key} = e.currentTarget.dataset;
  //console.warn(e);  
  //console.warn( left, top ,index,key); 
  this.setData({
    currentSelectX: 0,
    currentSelectY: 0,
    currentSelectItem: top+":"+left,
    scale:1, 
    actype:1
    }) 
},
  // 当前行切换 
  toImageTextItem(e) {
    const { left, top ,rate,img,index,key} = e.currentTarget.dataset;
    //console.warn(e);  
    console.warn( left, top ,index,key,rate,img,"text-item"+top+'-'+left); 
    // wx.createSelectorQuery().in(this).select(".text-item"+img).boundingClientRect((rect)=>{
    //   console.log(rect)
    //   this.setData({scrollViewWidth:Math.round(rect.width)}) // scroll-view元素长度

    //   }).exec((res) => {
    //     const scrollView = res[0].node;
    //       console.warn("toImageTextItem:",res);
    //     })
    let currentScrollView = wx.createSelectorQuery().in(this).select(".text-item"+img);

    
    // wx.ScrollViewContext.scrollIntoView({
    //   selector: ".text-item"+rate,
    //   duration: 300
    // })
    this.setData({
      currentSelectY: 0,
      currentSelectX: 0,
      currentSelectItem: top+":"+left,
      scale:1
      });
      xy.setClipboardData(top+":"+left);
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
    show=false;
  }
  if(actype==1){
  }if(actype==10){
    currentVisti=0;
    show=true;
  }else if(actype==11){
    currentVisti=1;
    show=true;
  }else if(actype==20){
  }else if(actype==30){
  }else if(actype==40){//显示隐藏结果 
    const oldLang = this.data.oldfromLang;
    const oldtoLang =this.data.oldtoLang;
    
    const current= app.getCurrentLang(this);
    //console.log("actype====40老：",oldLang+","+oldtoLang+";新的:"+current.currentLang+"："+current.currentTargetLang);
    // 嚴格判斷語言是否切換，切換自動幫用戶翻譯數據
    if(oldLang==current.currentLang && oldtoLang==current.currentTargetLang){
    }else{
      // 用戶未修改系統不進行語言操作
      if(wx.getStorageSync("currentLang")&&wx.getStorageSync("currentTargetLang")&&oldLang&&oldtoLang){
        // 此处需要校验是否重复检测相同图片
        if(this.data.options){ 
          wx.showLoading({
            title: '检测到您修改了配置语言，正在校对中',
          })
          
          // const oldLangList=this.data.langList;
          // oldLangList.list=[];
          // 清空之前的图片数据，避免重复追加
          this.setData({
            langList:[]
          })
          this.reloadPicinfo(this.data.options);
        }
         
      }
    }
    this.setData({
      actype: actype, 
      showResult: this.data.showResult==1?0:1, 
      see:false,
      oldfromLang:current.currentLang,
      oldtoLang:current.currentTargetLang,
      scale:this.data.showResult==1?1.8:1
    }) 
  }
  //console.warn("actypeactype:",  actype );   
  this.setData({
    actype: actype,
    action:show, 
    see:show?true:false,
    scale:actype==0?(this.data.scale<0.5?0.8:0.9):1//需要添加缩放比例记录，或者采用图片等比设置，
    })
},
// 图片具体文字内容识别
getPictureInfo(picUrl,currentImgobj){
//  picUrl="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg";
  const tThis=this;
  wx.showLoading({ title: "正在翻译中...", mask: true });
  const curent = app.getCurrentLang(tThis);
  //console.warn("getPictureInfogetPictureInfo:",  picUrl , currentImgobj);   
  let pictureInfo = app.request("/api/translate/photo", { 
    "source": curent.currentLang, //来源语音
      "target": curent.currentTargetLang, //目标语言 
      "url": picUrl,  
      // "url": "https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg",  
    }, "POST"); 
    pictureInfo.then((res)=>{
        //console.warn("getPictureInfo",res.data);
        wx.hideLoading();
        currentImgobj.list=res.data;
        let oldImageList=tThis.data.langList
        oldImageList.push(currentImgobj);
        //console.warn("oldImageList-update",oldImageList);

        tThis.setData({
          langList: oldImageList
          }) 
    }).catch(err => {
      wx.hideLoading(); 
      //console.log('err:', err,err.indexOf("err: OCR 服务异常"))
      if(err.indexOf("err: OCR 服务异常")==-1){
        app.showModalClose("当前排队的人太多，请稍后重试……",2000);
        setTimeout(function(){
          wx.navigateTo({
            url: '../index/index'
          })
        },3000)
        return false;
      }
      tThis.setData({
        langList:[{
          list:[{
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
        }]
      })
    })
    
},
//初始化图片信息
initialImgText(){ 
  let originText="";
  let translateText="";
  const langList = this.data.langList;
  //console.warn("this.data.langList:",this.data.langList);
  langList.forEach((item,index)=>{
    item.list.forEach(function(picture,key){

      // //console.log("initialImgText:::item,index:",item,index)
      originText+=picture.single_str_utf8+"\n";
      translateText+=picture.translate+"\n";
    });
  })
  return {
    originText:originText,
    translateText:translateText
  };
},
// 复制原文
copyOriginal(){
  const imgText = this.initialImgText();
  //console.log("copyOriginal:",imgText)
  xy.setClipboardData(imgText.originText);
},
// 仅复制翻译结果
copyTranslate(){
  const imgText = this.initialImgText();
  //console.log("copyOriginal:",imgText)
  xy.setClipboardData(imgText.translateText);
},
// 复制原文和结果
copyBoth(){
  const imgText = this.initialImgText();
  //console.log("copyOriginal:",imgText)
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
    this.payComponent = this.selectComponent("#pay");
    this.rateComponent = this.selectComponent("#rate");
    // app.userCenterLogin();
    // xy.showTip("服务器正在解析资源"); 
    app.globalData.selectPicturPath=options.selectPicturPath;
      this.setData({
      options: options
    })
   let tThis=this;
    app.globalLogin(this,function(){
      app.getCurrentLang(tThis);
      // app.globalData.selectPicturPath="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg";
      // options.selectPicturPath="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg";
      //主动根据请求体中的信息来判断加载资源信息
      tThis.reloadPicinfo(options); 
    });
    
  },
  //是否重写获取数据（用户存在切换语言操作）
  reloadPicinfo(options){
    const tThis=this; 
    if(options.ismultiple==1){
      const imagesArr = options.selectPicturPath?options.selectPicturPath.split("---"):[];
      // 需要重置当前图片信息
      
      // tThis.setData({
      //   langList: []
      //   }) 
      //console.warn("imagesArr:::",imagesArr);
      imagesArr.forEach(function(item,key){

        tThis.getImageInfoByOption(tThis,{
          selectPicturPath:item
        });
      });
    }else{      
      this.getImageInfoByOption(tThis,options);
    }
  },
  getPictureRate(pic){
    const sysInfo= wx.getSystemInfoSync()
    const windowWidth =sysInfo.windowWidth
    //console.warn("sysInfo:",sysInfo)
    //console.warn("picpic:",pic)
    if(pic.width>windowWidth){
      //console.warn("picpic-rate:",windowWidth/pic.width) 
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
   calculateCanvasDimensions(imgWidth, imgHeight, canvasWidth, canvasHeight) {
    // 计算图片宽高比
    const imgRatio = imgWidth / imgHeight;
  
    // 判断canvas宽度和高度哪个更受限（即较小的那个）
    let canvasRatio;
    if (canvasWidth / canvasHeight > imgRatio) {
      // 宽度受限，按照canvas的高度来缩放图片
      canvasRatio = canvasHeight / imgHeight;
    } else {
      // 高度受限，按照canvas的宽度来缩放图片
      canvasRatio = canvasWidth / imgWidth;
    }
    return {
      canvasRatio: canvasRatio,
      scaledWidth: imgWidth* canvasRatio,
      scaledHeight: canvasHeight* canvasRatio
    }; 
  }, 
  // 构造一张图片结构体
 getImageInfoByOption(tThis,options){
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
        const sysInfo= wx.getSystemInfoSync();
        const windowWidth =sysInfo.windowWidth;
        //console.warn("sysInfo:",sysInfo) ;
        app.globalData.screenWidth=windowWidth;
        //console.log("getImageInfoByOption:",res) 

        // let canvasRatio = tThis.calculateCanvasDimensions(res.width,res.height,windowWidth,sysInfo.windowHeight-140);
        // //console.warn("canvascanvasRatioRatiocanvasRatio",canvasRatio); 
        // 获取所以图片信息并添加到当前的结构体中
        tThis.getPictureInfo(options.selectPicturPath,{ 
          selectPicturWidth: res.width, 
          selectPicturHeight: res.height, 
          currentSelectX: 0, 
          currentSelectY: 60, 
          windowWidth: windowWidth, 
          windowHeight: sysInfo.windowHeight-140, 
          selectPicturPath: options.selectPicturPath,
          // scale: (canvasRatio.canvasRatio)<0.3?0.3:(canvasRatio.canvasRatio-0.1)
        })
       
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
      //console.log('app.globalData.subscribe.is_vip', app.globalData.subscribe)
      this.setData({
        notVip: !app.globalData.subscribe.is_vip
      })
    } else {
      app.userCenterLoginCallbackIndex = () => {
        //console.log('app.globalData.subscribe.is_vip', app.globalData.subscribe)
        this.setData({
          notVip: !app.globalData.subscribe.is_vip
        })
      };
    }

  },
  methods: {
     
    listenstartMove(event){
      //console.warn("listenstartMove",event)
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
})