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
    screenHeight: 0,       // 可视区域高度
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
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAnCAYAAAB5XdqFAAAAAXNSR0IArs4c6QAAAa5JREFUWEftWO1xwjAMlVgENilsVFgAWKB0o5pNYBHUk4NT25Edc/gj13N+JrL8/BRJz0IIPJtP2sIKtkTwgQTn2zeqkG2N9yhtwiAJ4cf+dr+gY6sPUulhkiZAJZCMBwl2htX1nvgQ1YAiwhmdECNcieAoEKXuF9zx+9BBSpOLCeyMIFsDpQgbDkhjt95TbE0JchVuDnSaC7e/c2RNCZCg/1EdzilYkUkbRa2sNwk8Zv0zSY6IcL194akINW84FevoG/6KLe1Ac1PbGa3OKFeD1spJa42gzHNr62xdzc2g70+WeUK3stUTNwh2xFq1NMCnchs6kxEbHOJQe7T1aO1eP8g8L8SSzmRD060WK/NskE1lXkwJ+SDbyjzhfqR/YCvcE5k3rJFuAtlzy4ikQeb9bazvQTGQ2ZEkOpzcLJdQ3CXsvdcnRjTZrDOaTFWi4f9gVIuPB6glVIIgo/4ExR+SJUYsm5kIVBrz+DIvMLTIBsxypHjsOQ4gTIhDs6iWMk93y4QhmdNSW8q86MCry7zX/uZh4iwmz4zM0/us6kyd+XYxZr0Ntsu818LtWP8C2qAB1K88MiMAAAAASUVORK5CYII=",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAnCAYAAAB5XdqFAAAAAXNSR0IArs4c6QAAAa5JREFUWEftWO1xwjAMlVgENilsVFgAWKB0o5pNYBHUk4NT25Edc/gj13N+JrL8/BRJz0IIPJtP2sIKtkTwgQTn2zeqkG2N9yhtwiAJ4cf+dr+gY6sPUulhkiZAJZCMBwl2htX1nvgQ1YAiwhmdECNcieAoEKXuF9zx+9BBSpOLCeyMIFsDpQgbDkhjt95TbE0JchVuDnSaC7e/c2RNCZCg/1EdzilYkUkbRa2sNwk8Zv0zSY6IcL194akINW84FevoG/6KLe1Ac1PbGa3OKFeD1spJa42gzHNr62xdzc2g70+WeUK3stUTNwh2xFq1NMCnchs6kxEbHOJQe7T1aO1eP8g8L8SSzmRD060WK/NskE1lXkwJ+SDbyjzhfqR/YCvcE5k3rJFuAtlzy4ikQeb9bazvQTGQ2ZEkOpzcLJdQ3CXsvdcnRjTZrDOaTFWi4f9gVIuPB6glVIIgo/4ExR+SJUYsm5kIVBrz+DIvMLTIBsxypHjsOQ4gTIhDs6iWMk93y4QhmdNSW8q86MCry7zX/uZh4iwmz4zM0/us6kyd+XYxZr0Ntsu818LtWP8C2qAB1K88MiMAAAAASUVORK5CYII=",
        "text": "返回编辑",
        "actype": 10,
        "type":0
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAADESURBVEiJ7ZXRDYIwGITvDHvQTawbAQuAC6gbAZvgIp4vhBQC/FXBJ763Npcv7Z/mCuwIrYArVH0i7G4c8qtyl8mLqD+RP+8cnPbJM/kYqYgSgA/lm5HmqtNcCveScOEKVRLOsUISbTjjKSO5hDJW3Oe9y9R0DzarcpfJ93dqKFxNcT/jtUwyt7l0kpA0l3nLkxX4hUN+yOOZfeffQKIdN8uG8rmO+f9YYjpcVgCTz2LaxzFQuJitCACk3YYjXlis2915A9O0QEmmKMh4AAAAAElFTkSuQmCC",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAADESURBVEiJ7ZXRDYIwGITvDHvQTawbAQuAC6gbAZvgIp4vhBQC/FXBJ763Npcv7Z/mCuwIrYArVH0i7G4c8qtyl8mLqD+RP+8cnPbJM/kYqYgSgA/lm5HmqtNcCveScOEKVRLOsUISbTjjKSO5hDJW3Oe9y9R0DzarcpfJ93dqKFxNcT/jtUwyt7l0kpA0l3nLkxX4hUN+yOOZfeffQKIdN8uG8rmO+f9YYjpcVgCTz2LaxzFQuJitCACk3YYjXlis2915A9O0QEmmKMh4AAAAAElFTkSuQmCC",
        "text": "复制内容",
        "actype": 20,
        "type":0
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAAXNSR0IArs4c6QAAAXRJREFUWEftWNGVAjEIBBvRTm7tSK+B0wbUjlw70Uq4lzzZt0Y2ARJ/7pLfXWAyTCAEocHa7GgghB8AGBDheD/hoYFbwFonT2DXuZ9WAKvAbb7pQBQZk9aIBMf7BUcvAW5w6z0FtoZS4BoWzeDm+ioB4+9egCZwhTSWsI6PM25LP71oV/tzJTAOYwKoZi6kE1YwEMGXsKFUe+IhQISbpcyoweUYTg/H44xN/DZx8r/BsaaW0pfTioU5S5yYVs1JRILtUrW3gFvviUoVgmOhBlhwliukWnBSH15qfaEmomYnrcAFP+q2R/AGLjZraTe5Bq5ljv1G3SWLr1xTy5PAWVuMxIanzqXyCrpL02pqL7xLK3NSZjq4wEpPa6lYds3NGPp7p7XF3PqxUqLVZu6/Ds7LYmeuM+dlwGvXNfdR5sKTgTdAjd3zmWO6vvNNWPXOVhPYYxvBaUdDTwCvDY+h6qHaG8hhN92MXh5ypJHN4bzKZD6C/gK2UJQBoyspTQAAAABJRU5ErkJggg==",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAnCAYAAAB5XdqFAAAAAXNSR0IArs4c6QAAAa5JREFUWEftWO1xwjAMlVgENilsVFgAWKB0o5pNYBHUk4NT25Edc/gj13N+JrL8/BRJz0IIPJtP2sIKtkTwgQTn2zeqkG2N9yhtwiAJ4cf+dr+gY6sPUulhkiZAJZCMBwl2htX1nvgQ1YAiwhmdECNcieAoEKXuF9zx+9BBSpOLCeyMIFsDpQgbDkhjt95TbE0JchVuDnSaC7e/c2RNCZCg/1EdzilYkUkbRa2sNwk8Zv0zSY6IcL194akINW84FevoG/6KLe1Ac1PbGa3OKFeD1spJa42gzHNr62xdzc2g70+WeUK3stUTNwh2xFq1NMCnchs6kxEbHOJQe7T1aO1eP8g8L8SSzmRD060WK/NskE1lXkwJ+SDbyjzhfqR/YCvcE5k3rJFuAtlzy4ikQeb9bazvQTGQ2ZEkOpzcLJdQ3CXsvdcnRjTZrDOaTFWi4f9gVIuPB6glVIIgo/4ExR+SJUYsm5kIVBrz+DIvMLTIBsxypHjsOQ4gTIhDs6iWMk93y4QhmdNSW8q86MCry7zX/uZh4iwmz4zM0/us6kyd+XYxZr0Ntsu818LtWP8C2qAB1K88MiMAAAAASUVORK5CYII=",
        "text": "导出文件",  
        "actype": 30,
        "type":0
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAAXNSR0IArs4c6QAAAWFJREFUWEftWFEOwjAIBc+k/jpPZncy6696JlHMMNhUA9Uao+xnCaNvb4/utQVhuuaJhhnAQAQriT27I8JunzBJzmJD2zLGmEiwseJxnsZEDiwTJTKC6BcRwvqYME8ktvxMYq2YiDAKQWwFYSICpMnVYhbldI5gIJcDAAb1MFvBDiOuObdGTlXENE1KDozN5EjIaEmtBJ+R82CUFTyMiEHOomAoJ1ZiUUvndFNOGzn7npdYzWvf9kO0kCnHdFWutnx5SHcjV1u+PMS6lvXRCuEh+BHlWleZIBfKeSaz3h7JNqpx/G3X/D8mLGcQfQbwqPeRv/XrFv4w4VaPCuV+Ujm2jOn8C2HCHgOVgzXfv/IMIZ2DMGFPWcPnLm2o3GIFPZUr+3PWimZCGMvOpjbySu/PjH3tz+mvto6UvFrbVci9o2P6Uk+4R9v1ries1ZLdrEXBE0DWhjsptSrnLMdb8HjMGeMfj0YDLck0AAAAAElFTkSuQmCC",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAAXNSR0IArs4c6QAAAWFJREFUWEftWFEOwjAIBc+k/jpPZncy6696JlHMMNhUA9Uao+xnCaNvb4/utQVhuuaJhhnAQAQriT27I8JunzBJzmJD2zLGmEiwseJxnsZEDiwTJTKC6BcRwvqYME8ktvxMYq2YiDAKQWwFYSICpMnVYhbldI5gIJcDAAb1MFvBDiOuObdGTlXENE1KDozN5EjIaEmtBJ+R82CUFTyMiEHOomAoJ1ZiUUvndFNOGzn7npdYzWvf9kO0kCnHdFWutnx5SHcjV1u+PMS6lvXRCuEh+BHlWleZIBfKeSaz3h7JNqpx/G3X/D8mLGcQfQbwqPeRv/XrFv4w4VaPCuV+Ujm2jOn8C2HCHgOVgzXfv/IMIZ2DMGFPWcPnLm2o3GIFPZUr+3PWimZCGMvOpjbySu/PjH3tz+mvto6UvFrbVci9o2P6Uk+4R9v1ries1ZLdrEXBE0DWhjsptSrnLMdb8HjMGeMfj0YDLck0AAAAAElFTkSuQmCC",
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
    }else if(actype==61){//逐行对比显示
      showType=actype;
   }else if(actype==62){//左右对比显示
    showType=actype;
    }else if(actype==63){//仅显示译文
      showType=actype;
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
  }else if(actype==30){
    console.log("actype====3");
    show=true;
  }else if(actype==40){
    console.log("actype====3");
    show=true;
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
translateText(){
  const tThis = this;
  const fromText = this.data.fromText;
  if(fromText.length<1){
    wx.showLoading({ title: "翻译内容不能为空...", mask: true });
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    return false;
  } 
  xy.checkTextSync({
    content: fromText,
    successFunc: tThis.translate,
    failFunc: (err) => {
      xy.showTip(err.msg);
    },
  });
},

  // 翻译
  translate: function () { 
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
        target: wx.getStorageSync("currentTargetLang")||"en",
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
    this.translateText();
    app.getCurrentLang(this);
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