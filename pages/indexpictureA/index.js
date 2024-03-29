// pages/indexpicture/index.js
import * as xy from "../../utils/common.js";
const { adVideoUtils } = require('../../components/custom-ads/Rewarded-Ads/index.js');
import MinaTouch from './minitouch'; //引入mina-touch
const app = getApp();
function debounce(func, delay) {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
} 
function throttle(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(function() {
        func.apply(context, args);
        timeout = null;
      }, wait);
    }
  }
} 
var angle = 0,
  zoom = 1,translateY=0,translateX=0;

Page({  
  /**                  
   * 页面的初始数据
   */
  data: { 
    angle: 0,
    zoom: 1, 
    translateX: 0,
    translateY: 1,
    navbarWidthStatus: app.globalData.navbarWidthStatus, //导航栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度  
    screenWidth: app.globalData.screenWidth , //可视区域高度  
    notVip:false,
    isAllowSee:false,//是否允许查看
    actions:{},//动作信息
    see:false,
    selectPicturPath:app.globalData.selectPicturPath,
    action:false,
    actype:10,//10逐行对比左右布局,11，逐行对比垂直布局; 20复制内容，30导出文件，40显示结果，41隐藏
    currentVisti:0,//排列方式
    showResult:1,
    oldfromLang:"",
    oldtoLang:"",
    isSingleImages:true,
    options:{},
    countImages:0,
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
  multipleList:[],
    istranslate:true,  
    scale:1, 
    ccWidth:0,
    ccHeight:0,
    selectPicturWidth: 500, 
    selectPicturHeight: 600,
    currentSelectItem:"",
    currentSelectX:20,
    currentSelectY:40, 
    lastScale: 1,
    toBase64_url: "",
    scene: "template_unlock_image",
    startTouches: [],
    totalHeight: app.globalData.screenHeight-140,   
    totalWidth: app.globalData.screenWidth ,  
  }, 
  // 底部功能切换，判断用户动作权限 
  selectFunction(e) {
    const { index, actype } = e.currentTarget.dataset;
    //console.warn(index,  actype, this.data.actype ); 
    const tThis=this;
    wx.showLoading({
      title: '请稍等……',
    })
    const actions=this.data.actions;
   // console.warn("actions:",this.data.actions);
    if(actions.before_action_type==0){//成功
        tThis.setData({
          "isAllowSee":true
        })
    } 
    
    this.neeDToaction(actype);

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
  this.neeDToaction(40);
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
    //      // console.warn("toImageTextItem:",res);
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
  let show = this.data.action?(this.data.actype==actype?false:true):true;
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
    show=false;
    const current= app.getCurrentLang(this);
    //console.log("actype====40老：",oldLang+","+oldtoLang+";新的:"+current.currentLang+"："+current.currentTargetLang);
    // 嚴格判斷語言是否切換，切換自動幫用戶翻譯數據
    // if(oldLang==current.currentLang && oldtoLang==current.currentTargetLang){
    // }else{
      // 用戶未修改系統不進行語言操作(已经添加修改语言的异步获取的操作，暂时排除)
      // if(wx.getStorageSync("currentLang")&&wx.getStorageSync("currentTargetLang")&&oldLang&&oldtoLang){
      //   // 此处需要校验是否重复检测相同图片
      //   if(this.data.options){ 
      //     wx.showLoading({
      //       title: '检测到您修改了配置语言，正在校对中',
      //     })
           
      //     // 清空之前的图片数据，避免重复追加
      //     this.setData({
      //       langList:[]
      //     })
      //     this.reloadPicinfo(this.data.options);
      //   }
         
      // }
    // }
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
getPictureInfo(picUrl,currentImgobj,key){ 
  const tThis=this;
  wx.showLoading({ title: "正在翻译中...", mask: true });
  const curent = app.getCurrentLang(tThis);
  //console.warn("getPictureInfogetPictureInfo:",  picUrl , currentImgobj);   
  let pictureInfo = app.request("/api/translate/photo", { 
    "source": curent.currentLang, //来源语音
      "target": curent.currentTargetLang, //目标语言 
      "url": picUrl,  
    }, "POST"); 
    let multipleList=tThis.data.multipleList;
    pictureInfo.then((res)=>{
        //console.warn("getPictureInfo",res.data);
        // wx.hideLoading();
        currentImgobj.list=res.data;
       
        if(tThis.data.isSingleImages){  // 单独图直接替换构造体
          tThis.setData({
            langList: [currentImgobj]
            }); 
           // console.warn("multipleList::isSingleImages:",multipleList);
            wx.hideLoading();
        }else{
          const totalUploadImages=app.globalData.totalUploadImages;
          totalUploadImages.unshift(picUrl);
         // console.warn("multipleList:BACK::",totalUploadImages);
          app.globalData.totalUploadImages=totalUploadImages;
         // console.warn("multipleImage:multipleList",key,app.globalData.currentPictureInfoCount,tThis.data.countImages); 
          app.globalData.currentPictureInfoCount=app.globalData.currentPictureInfoCount+1;
            multipleList.push(currentImgobj); 
          //  完成所有请求更新全部信息(重新渲染)
            if(totalUploadImages.length==tThis.data.countImages&&app.globalData.currentPictureInfoCount==tThis.data.countImages){ 
                //  let oldImageList=tThis.data.langList;
                  tThis.setData({
                  langList: multipleList
                    });
                    wx.hideLoading();
                   // console.warn("multipleList:BACK::",multipleList);
            }else{
              tThis.setData({
                langList: multipleList
                });
            }
        }
    }).catch(err => {
      // wx.hideLoading(); 
      console.log('err:', err);
      setTimeout(function(){
        wx.hideLoading();
      },2000);
      return false;
      if(err&&err.indexOf("err: OCR 服务异常")==-1){
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
  /**
   * 生命周期函数--监听页面加载
   */
    
  // 子组件回调语言改变
  listenLanguge(){
    console.log("listenLanguge--");
    if(this.data.isAllowSee){ 
      this.data.options&&this.reloadPicinfo(this.data.options); 
    }
  },
  onLoad(options) {  
    this.actionComponent = this.selectComponent("#action");
    this.initTouch();
    // options={
    //   ismultiple:1,
    //   selectPicturPath:"https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg---https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg---https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/3.jpg",
    // };
    this.setData({
      options: options
    })
   let tThis=this;
    app.globalLogin(this,function(){
      app.getCurrentLang(tThis);
      tThis.getActions();//初始化动作信息
      // app.globalData.selectPicturPath="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg";
      // options.selectPicturPath="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg";
      //主动根据请求体中的信息来判断加载资源信息
      tThis.reloadPicinfo(options); 
    });
    
  },
  initTouch(){
    const that = this;
    new MinaTouch(this, 'touch1', {
      //会创建this.touch1指向实例对象
      touchStart: function () {},
      touchMove: function (e) {
         console.log("touchMove>>>",e); 
        //  throttle(function(e){
           
         const touch0=e.touches[0];
         if(e.touches.length>1){
            
          const touch1=e.touches[1];
          translateX=-(touch1.pageX-touch0.pageX);
          translateY=-(touch1.pageY-touch0.pageY);
            that.setData({
                zoom:zoom,
                translateX:translateX,
                translateY:translateY,
              });
          // }, 500);
         }
        // that.setData({
        //   zoom
        // });
      },
      touchEnd: function () {},
      touchCancel: function () {},
      multipointStart: function (evt) {}, //一个手指以上触摸屏幕触发
      multipointEnd: function () {}, //当手指离开，屏幕只剩一个手指或零个手指触发(一开始只有一根手指也会触发)
      tap: function () {}, //点按触发，覆盖下方3个点击事件，doubleTap时触发2次
      doubleTap: function () {}, //双击屏幕触发
      longTap: function () {}, //长按屏幕750ms触发
      singleTap: function () {}, //单击屏幕触发，包括长按
      // rotate: function (evt) {
      //   //evt.angle代表两个手指旋转的角度
      //   console.log(evt.angle);
      //   angle = that.data.angle + evt.angle;
      // },
      pinch: function (evt) {
        //evt.zoom代表两个手指缩放的比例(多次缩放的累计值),evt.singleZoom代表单次回调中两个手指缩放的比例
        console.log('pinch:' + evt.zoom);
        zoom = evt.zoom;
        that.setData({
          zoom,
        });
      },
      pressMove: function (evt) {
        //evt.deltaX和evt.deltaY代表在屏幕上移动的距离,evt.target可以用来判断点击的对象
        // console.log(evt.target);
        // console.log(evt.deltaX);
    // console.log("pressMove",evt.deltaX,evt.deltaY); 
    //     throttle(function(){
    //       that.pressView(evt.deltaX,evt.deltaY,e)
    //     }, 500);
      },
      swipe: function (evt) {
        //在touch结束触发，evt.direction代表滑动的方向 ['Up','Right','Down','Left']
        // console.log("swipe:" + evt.direction);
      },
    });
  },
  pressView(deltaX,deltaY,e) {
    let translateX = this.data.translateX;
    let translateY = this.data.translateY;
    console.log("pressView----",deltaX,deltaY,translateX,translateY,e); 
    translateX -= deltaX;
    translateY -= deltaY;
    console.log("pressView----",translateX,translateY,e); 

    // if (translateX < 0) translateX = 0;
    // if (translateX > 200) translateX = 200;
    this.setData({
      translateX:translateX,
      translateY:translateY,
    });
  },
  // 默认先展示图片列表，数据后渲染
  initPictureListFirst(){

  },
  // 计算所有图片总宽高
  adjustTotalHeightMaxWidth(ImageArr){
    let totalWidth=this.data.screenWidth;
    let totalHeight=0;
    ImageArr.forEach(function(item,index){
      // totalWidth=totalWidth+item.selectPicturWidth;
      totalHeight=totalHeight+item.selectPicturHeight;
    });
    const maxWidth=Math.max.apply(null, ImageArr.map(item => item.selectPicturWidth));
    this.setData({ 
      totalWidth:maxWidth,
      totalHeight:totalHeight,
      screenWidth:app.globalData.screenWidth
      })
     // console.warn("totalWidth,totalHeight::",totalWidth,totalHeight);
    return {
      totalWidth:totalWidth,
      totalHeight:totalHeight,
    }
  },
  //是否重写获取数据（用户存在切换语言操作）
  reloadPicinfo(options){
    app.globalData.totalUploadImages=[];
    app.globalData.currentUploadImages=[];
    app.globalData.currentPictureInfoCount=0;
     //重置列表
    this.setData({ 
      langList:[],
      countImages:0,
    })
    const tThis=this; 
    //多图模式异步获取
    const imagesArr = options.selectPicturPath?options.selectPicturPath.split("---"):[];
    if(options.ismultiple==1&&imagesArr.length>1){ 
      
      tThis.setData({
        isSingleImages:false, 
        countImages: imagesArr.length
      }) 
      //console.warn("imagesArr:::",imagesArr);
      imagesArr.forEach(function(item,key){ 

        // 动态追加信息
        tThis.getImageInfoByOption(tThis,{
          selectPicturPath:item,
        },function(selectPicturPath,picObj,key){
          const ImageArr=tThis.data.langList; 
          ImageArr.unshift(picObj);
         // console.warn("getImageInfoByOptiongetImageInfoByOptionMultiple",picObj,ImageArr,key);
            tThis.setData({
              langList: ImageArr,
              countImages: imagesArr.length,
              })
            if(key==imagesArr.length-1){ // 需要 
              const imgObg= tThis.adjustTotalHeightMaxWidth(ImageArr);
            }
             tThis.getPictureInfo(selectPicturPath,picObj,key);
        },key+1);
      });
    }else{//单图模式        
     this.getImageInfoByOption(tThis,options, function(selectPicturPath,picObj,key){
      app.globalData.currentPictureInfoCount=1;
      const ImageArr=[];
      ImageArr.unshift(picObj);
     // console.warn("getImageInfoByOptiongetImageInfoByOption",picObj,ImageArr) 
      const imgObg= tThis.adjustTotalHeightMaxWidth(ImageArr);
      tThis.setData({
        langList: ImageArr,
        isSingleImages:true, 
        countImages: 1,
        // totalWidth:imgObg.totalWidth,
        // totalHeight:imgObg.totalHeight,
        });
        tThis.getPictureInfo(selectPicturPath,picObj,key);
     },1)
    }
  }, 
   calculateCanvasDimensions(imgWidth, imgHeight, canvasWidth, canvasHeight) {
    // 计算图片宽高比
    const imgRatio = imgWidth / imgHeight;
    let canvasRatio=0.8;
    // 图片小于屏幕，放大图片
    if(imgWidth<canvasWidth){ 
      canvasRatio=imgWidth/canvasWidth;//*canvasRatio;
    }else{//缩小图片
      canvasRatio=canvasWidth/imgWidth;
    }
   // console.warn("sysInfossss2d:",imgWidth, imgHeight, canvasWidth, canvasHeight,imgHeight/imgWidth,canvasWidth/canvasHeight) ;
   // console.warn("sysInfossss2d:",this.data.screenWidth,canvasRatio) ;
    return {
      canvasRatio: canvasRatio,
      scaledWidth: imgWidth* canvasRatio,
      scaledHeight: canvasHeight* canvasRatio
    }; 
  }, 
  // 计算图片左上角距离
  reduceImageTransform(res,picRadio){
    const isSingle =this.data.isSingleImages;
    let transformStr="";
    if(isSingle){
      transformStr="transform-origin: 0 0 0;transform:scale("+(picRadio.canvasRatio*0.8)+","+(picRadio.canvasRatio*0.8)+") "+" translate(10%,15%)"
    }else{
      // transformStr=  "transform-origin: 0 0 0;transform:scale("+(picRadio.canvasRatio*0.8)+","+(picRadio.canvasRatio*0.8)+") translate(-"+((res.width*picRadio.canvasRatio)/4+20)+"px，-"+((res.height)*this.data.countImages+20)+"px)"
      transformStr=  "transform-origin: 0 -50%;transform:scale("+(picRadio.canvasRatio*0.8)+","+(picRadio.canvasRatio*0.8)+") translate(-"+((res.width*picRadio.canvasRatio)/4+20)+"px，-"+((res.height*picRadio.canvasRatio)/4+20)+"px)"
     // console.warn("reduceImageTransform::",isSingle,res,picRadio);
      // transformStr=  "transform-origin: 0 -90%;transform:scale("+(picRadio.canvasRatio*0.8)+","+(picRadio.canvasRatio*0.8)+") translate(-"+((res.width*picRadio.canvasRatio)/3.5)+"px，-"+((res.height*picRadio.canvasRatio)/3+20)+"px)"
      // transformStr=  "transform-origin: 0 -90%;transform:scale("+(picRadio.canvasRatio*0.8)+","+(picRadio.canvasRatio*0.8)+") translate(-"+((res.width*picRadio.canvasRatio)/3.5)+"px，-"+((res.height*picRadio.canvasRatio)/3+20)+"px)"
      // transformStr=  "transform-origin: 0 -90%;transform:scale("+(picRadio.canvasRatio*0.8)+","+(picRadio.canvasRatio*0.8)+") translate(-"+this.data.totalWidth+"px，-"+this.data.totalWidth+"px)"
    }
    return transformStr;
  },
  // 构造一张图片结构体
 getImageInfoByOption(tThis,options,callBack,key){
    if(!options.selectPicturPath){
      app.showModalClose("非法操作,图片不存在",2000);
      setTimeout(function(){
        wx.navigateTo({
          url: '../index/index'
        })
      },1000)
      return false;
    }
    wx.getImageInfo({
      src: options.selectPicturPath,
      success (res) {  
        const sysInfo= wx.getSystemInfoSync();
        const windowWidth =sysInfo.windowWidth;
       // console.warn("sysInfossss:",res,options.selectPicturPath,res.width,res.height,windowWidth,sysInfo.windowHeight,sysInfo) ;
        // app.globalData.screenWidth=windowWidth; 
        const picRadio = tThis.calculateCanvasDimensions( res.width,res.height,windowWidth,(sysInfo.windowHeight-100));
 
        // 获取所以图片信息并添加到当前的结构体中
        const picObj={ 
          selectPicturWidth: res.width, 
          selectPicturHeight: res.height, 
          currentSelectX: 0, 
          currentSelectY: 60,  
          windowWidth: windowWidth, 
          windowHeight: sysInfo.windowHeight-140, //imgWidth / imgHeight
          selectPicturPath: options.selectPicturPath, 
          canvasRatio: picRadio.canvasRatio, 
                
          transform: tThis.reduceImageTransform(res,picRadio)

        };
        // 异步获取图片信息
        callBack&&callBack(options.selectPicturPath,picObj,key);
       
      },
      fail:function(){
        return falses
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
  // 获取最新动作信息
  getActions(callback) {
    const sys = wx.getSystemInfoSync();
    const tThis=this;
      wx.request({
        url: app.globalData.globalHost + "/api/user/actions",
        method: "GET",
        header: {
          Authorization: app.globalData.access_token,
          "x-device-brand": sys.brand || "unknown",
          "x-device-path": getCurrentPages()[getCurrentPages().length - 1].route,
          "x-device-model": sys.model || "unknown",
          "x-device-system": sys.system || "unknown",
          "x-device-network": getApp().globalData.currentNetwork || "unknown",
        },
        success: (res) => {
          console.log("会员动作", res);
          tThis.setData({
            actions: res.data.data,
            isAllowSee:res.data.data.before_action_type==0?true:false
          });    
       
    
          this.setData({isAllowSee:true,notVip:true});//仅测试开启
          callback&&callback();

        },
      });
    },  
    // 判断权限是否通过
  neeDToaction(actype){
    const tThis=this;
    if(this.data.isAllowSee){
      tThis.showActionBox(actype); 
      wx.hideLoading();
    }else{
      this.doPre(()=>{  
        tThis.setData({
          "isAllowSee":true
        })
        tThis.showActionBox(actype);
        wx.hideLoading();
      })

    }
  },
      //------------------------------- 支付 --------------------------------
  doPre(successCallback) {
    wx.showLoading({ title: '加载中', mask: true })
    this.actionComponent.savePre(() => {
      console.log('成功执行回调')
      successCallback();
    })
  },


})