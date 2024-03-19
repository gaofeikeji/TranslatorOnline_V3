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
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAnCAYAAAB5XdqFAAAAAXNSR0IArs4c6QAAAa5JREFUWEftWO1xwjAMlVgENilsVFgAWKB0o5pNYBHUk4NT25Edc/gj13N+JrL8/BRJz0IIPJtP2sIKtkTwgQTn2zeqkG2N9yhtwiAJ4cf+dr+gY6sPUulhkiZAJZCMBwl2htX1nvgQ1YAiwhmdECNcieAoEKXuF9zx+9BBSpOLCeyMIFsDpQgbDkhjt95TbE0JchVuDnSaC7e/c2RNCZCg/1EdzilYkUkbRa2sNwk8Zv0zSY6IcL194akINW84FevoG/6KLe1Ac1PbGa3OKFeD1spJa42gzHNr62xdzc2g70+WeUK3stUTNwh2xFq1NMCnchs6kxEbHOJQe7T1aO1eP8g8L8SSzmRD060WK/NskE1lXkwJ+SDbyjzhfqR/YCvcE5k3rJFuAtlzy4ikQeb9bazvQTGQ2ZEkOpzcLJdQ3CXsvdcnRjTZrDOaTFWi4f9gVIuPB6glVIIgo/4ExR+SJUYsm5kIVBrz+DIvMLTIBsxypHjsOQ4gTIhDs6iWMk93y4QhmdNSW8q86MCry7zX/uZh4iwmz4zM0/us6kyd+XYxZr0Ntsu818LtWP8C2qAB1K88MiMAAAAASUVORK5CYII=",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAnCAYAAAB5XdqFAAAAAXNSR0IArs4c6QAAAa5JREFUWEftWO1xwjAMlVgENilsVFgAWKB0o5pNYBHUk4NT25Edc/gj13N+JrL8/BRJz0IIPJtP2sIKtkTwgQTn2zeqkG2N9yhtwiAJ4cf+dr+gY6sPUulhkiZAJZCMBwl2htX1nvgQ1YAiwhmdECNcieAoEKXuF9zx+9BBSpOLCeyMIFsDpQgbDkhjt95TbE0JchVuDnSaC7e/c2RNCZCg/1EdzilYkUkbRa2sNwk8Zv0zSY6IcL194akINW84FevoG/6KLe1Ac1PbGa3OKFeD1spJa42gzHNr62xdzc2g70+WeUK3stUTNwh2xFq1NMCnchs6kxEbHOJQe7T1aO1eP8g8L8SSzmRD060WK/NskE1lXkwJ+SDbyjzhfqR/YCvcE5k3rJFuAtlzy4ikQeb9bazvQTGQ2ZEkOpzcLJdQ3CXsvdcnRjTZrDOaTFWi4f9gVIuPB6glVIIgo/4ExR+SJUYsm5kIVBrz+DIvMLTIBsxypHjsOQ4gTIhDs6iWMk93y4QhmdNSW8q86MCry7zX/uZh4iwmz4zM0/us6kyd+XYxZr0Ntsu818LtWP8C2qAB1K88MiMAAAAASUVORK5CYII=",
        "text": "逐行对比",
        "actype": 1,
        "type":0
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAApCAYAAAC/QpA/AAAAAXNSR0IArs4c6QAAAQ5JREFUWEftmNERgjAMQJNJYBNhI3EBcQF1I3ETXMR49SyHsa0JtPoTPksaXl9C71oE4VN1dAGARhiuCkOEw3jEHiWz6h31RLCXxC6NQYJWBrOlhhCcmWKPsyOCcQQvO5vMNFPZVTCZIaBmtg3GG06acS9zl8LnG8848NxBGD5YCGi4nbCd5w7ClNzM2MLegGIwVMgGT6uHcb9YLji2a6thPmq7BqzqaG7dYCaZZibWV2bGzGj3HOsZ6xnrGa0B6xmtMdtnlvSMPzI/595hcMcZTKnUloXHa3MbTMy4mRGbQYTr2sb181OHuNA3eJlycYTyfD0gOphit5hzIn+jmVot/utKJFgmP/jry6IQzAOg+azkFYYJZgAAAABJRU5ErkJggg==",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAApCAYAAAC/QpA/AAAAAXNSR0IArs4c6QAAAQ5JREFUWEftmNERgjAMQJNJYBNhI3EBcQF1I3ETXMR49SyHsa0JtPoTPksaXl9C71oE4VN1dAGARhiuCkOEw3jEHiWz6h31RLCXxC6NQYJWBrOlhhCcmWKPsyOCcQQvO5vMNFPZVTCZIaBmtg3GG06acS9zl8LnG8848NxBGD5YCGi4nbCd5w7ClNzM2MLegGIwVMgGT6uHcb9YLji2a6thPmq7BqzqaG7dYCaZZibWV2bGzGj3HOsZ6xnrGa0B6xmtMdtnlvSMPzI/595hcMcZTKnUloXHa3MbTMy4mRGbQYTr2sb181OHuNA3eJlycYTyfD0gOphit5hzIn+jmVot/utKJFgmP/jry6IQzAOg+azkFYYJZgAAAABJRU5ErkJggg==",
        "text": "复制内容",
        "actype": 20,
        "type":0
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAAXNSR0IArs4c6QAAAXRJREFUWEftWNGVAjEIBBvRTm7tSK+B0wbUjlw70Uq4lzzZt0Y2ARJ/7pLfXWAyTCAEocHa7GgghB8AGBDheD/hoYFbwFonT2DXuZ9WAKvAbb7pQBQZk9aIBMf7BUcvAW5w6z0FtoZS4BoWzeDm+ioB4+9egCZwhTSWsI6PM25LP71oV/tzJTAOYwKoZi6kE1YwEMGXsKFUe+IhQISbpcyoweUYTg/H44xN/DZx8r/BsaaW0pfTioU5S5yYVs1JRILtUrW3gFvviUoVgmOhBlhwliukWnBSH15qfaEmomYnrcAFP+q2R/AGLjZraTe5Bq5ljv1G3SWLr1xTy5PAWVuMxIanzqXyCrpL02pqL7xLK3NSZjq4wEpPa6lYds3NGPp7p7XF3PqxUqLVZu6/Ds7LYmeuM+dlwGvXNfdR5sKTgTdAjd3zmWO6vvNNWPXOVhPYYxvBaUdDTwCvDY+h6qHaG8hhN92MXh5ypJHN4bzKZD6C/gK2UJQBoyspTQAAAABJRU5ErkJggg==",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAAXNSR0IArs4c6QAAAXRJREFUWEftWNGVAjEIBBvRTm7tSK+B0wbUjlw70Uq4lzzZt0Y2ARJ/7pLfXWAyTCAEocHa7GgghB8AGBDheD/hoYFbwFonT2DXuZ9WAKvAbb7pQBQZk9aIBMf7BUcvAW5w6z0FtoZS4BoWzeDm+ioB4+9egCZwhTSWsI6PM25LP71oV/tzJTAOYwKoZi6kE1YwEMGXsKFUe+IhQISbpcyoweUYTg/H44xN/DZx8r/BsaaW0pfTioU5S5yYVs1JRILtUrW3gFvviUoVgmOhBlhwliukWnBSH15qfaEmomYnrcAFP+q2R/AGLjZraTe5Bq5ljv1G3SWLr1xTy5PAWVuMxIanzqXyCrpL02pqL7xLK3NSZjq4wEpPa6lYds3NGPp7p7XF3PqxUqLVZu6/Ds7LYmeuM+dlwGvXNfdR5sKTgTdAjd3zmWO6vvNNWPXOVhPYYxvBaUdDTwCvDY+h6qHaG8hhN92MXh5ypJHN4bzKZD6C/gK2UJQBoyspTQAAAABJRU5ErkJggg==",
        "text": "导出结果",  
        "actype": 30,
        "type":0
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAAXNSR0IArs4c6QAAAWFJREFUWEftWFEOwjAIBc+k/jpPZncy6696JlHMMNhUA9Uao+xnCaNvb4/utQVhuuaJhhnAQAQriT27I8JunzBJzmJD2zLGmEiwseJxnsZEDiwTJTKC6BcRwvqYME8ktvxMYq2YiDAKQWwFYSICpMnVYhbldI5gIJcDAAb1MFvBDiOuObdGTlXENE1KDozN5EjIaEmtBJ+R82CUFTyMiEHOomAoJ1ZiUUvndFNOGzn7npdYzWvf9kO0kCnHdFWutnx5SHcjV1u+PMS6lvXRCuEh+BHlWleZIBfKeSaz3h7JNqpx/G3X/D8mLGcQfQbwqPeRv/XrFv4w4VaPCuV+Ujm2jOn8C2HCHgOVgzXfv/IMIZ2DMGFPWcPnLm2o3GIFPZUr+3PWimZCGMvOpjbySu/PjH3tz+mvto6UvFrbVci9o2P6Uk+4R9v1ries1ZLdrEXBE0DWhjsptSrnLMdb8HjMGeMfj0YDLck0AAAAAElFTkSuQmCC",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAAXNSR0IArs4c6QAAAWFJREFUWEftWFEOwjAIBc+k/jpPZncy6696JlHMMNhUA9Uao+xnCaNvb4/utQVhuuaJhhnAQAQriT27I8JunzBJzmJD2zLGmEiwseJxnsZEDiwTJTKC6BcRwvqYME8ktvxMYq2YiDAKQWwFYSICpMnVYhbldI5gIJcDAAb1MFvBDiOuObdGTlXENE1KDozN5EjIaEmtBJ+R82CUFTyMiEHOomAoJ1ZiUUvndFNOGzn7npdYzWvf9kO0kCnHdFWutnx5SHcjV1u+PMS6lvXRCuEh+BHlWleZIBfKeSaz3h7JNqpx/G3X/D8mLGcQfQbwqPeRv/XrFv4w4VaPCuV+Ujm2jOn8C2HCHgOVgzXfv/IMIZ2DMGFPWcPnLm2o3GIFPZUr+3PWimZCGMvOpjbySu/PjH3tz+mvto6UvFrbVci9o2P6Uk+4R9v1ries1ZLdrEXBE0DWhjsptSrnLMdb8HjMGeMfj0YDLck0AAAAAElFTkSuQmCC",
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
    ccWidth:0,
    ccHeight:0,
    selectPicturWidth: 500, 
    selectPicturHeight: 600,
    currentSelectItem:"",
    currentSelectX:0,
    currentSelectY:0,
    lastScale: 1,
    toBase64_url: "",
    scene: "template_unlock_image",
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
//点击图片显示对应视图的段落
toVerticleHorizonTextItem(e){
  const { left, top } = e.currentTarget.dataset;
  console.warn(e);  
  console.warn(left, top); 
  this.setData({
    currentSelectY: top,
    currentSelectX: left,
    currentSelectItem: top+":"+left,
    scale:1,
    action:true, 
    actype:1, 
    })
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
      console.log('err:', err,err.indexOf("err: OCR 服务异常"))
      if(err.indexOf("err: OCR 服务异常")==-1){
        app.showModalClose("当前排队的人太多，请稍后重试……",2000);
        setTimeout(function(){
          wx.navigateTo({
            url: '../index/index'
          })
        },2000)
        return false;
      }
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
    this.setData({ 
      ccWidth: options.ccWidth, 
      ccHeight: options.ccHeight,  
    });
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
        // const upload_pic_info= wx.getStorageSync('upload_pic_info') 
        // if(res.width>windowWidth){
        //   scale=windowWidth/res.width-0.05;
        //   console.warn("picpic-rate:",scale)  
        // }else{
        //   console.warn("picpic-upload_pic_info:",upload_pic_info)  
        //   if(upload_pic_info.width/res.width>2){
        //     scale=1.2;//upload_pic_info.width/res.width-0.6;
        //   }
        // }
        let canvasRatio = tThis.calculateCanvasDimensions(res.width,res.height,windowWidth,sysInfo.windowHeight-140);
        console.warn("canvascanvasRatioRatiocanvasRatio");
        console.warn(canvasRatio);
        tThis.setData({ 
          selectPicturWidth: res.width, 
          selectPicturHeight: res.height, 
          currentSelectX: res.width>windowWidth?(windowWidth-res.width)/2:(res.width-windowWidth)/2, 
          currentSelectY: 60, 
          windowWidth: windowWidth, 
          windowHeight: sysInfo.windowHeight-140, 
          // selectPicturWidth: upload_pic_info.width/res.width>2?upload_pic_info.width:res.width, 
          // selectPicturHeight: upload_pic_info.width/res.width>2?upload_pic_info.height:res.height, 
          selectPicturPath: options.selectPicturPath,
          scale: (canvasRatio.canvasRatio)<0.3?0.3:(canvasRatio.canvasRatio-0.1)
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
  methods: {
    

    // linstenerScale(event){
    //   console.warn("linstenerScale",event)
    // },
    listenstartMove(event){
      console.warn("listenstartMove",event)
    },
    listentouch(event){
      console.warn("listentouch",event)
    },
  },  
  linstenerScale(event){
    console.warn("linstenerScale",event)
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