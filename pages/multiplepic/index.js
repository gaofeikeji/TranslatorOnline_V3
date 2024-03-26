// pages/text/index.js

import * as xy from "../../utils/common.js";
const sys = wx.getSystemInfoSync();
const app = getApp();

  // 检查图片校验并上传 
export const confirmImginfo = (uploadPath) => {
  return new Promise((resolve, reject) => { 
    console.warn("confirmImginforesresres",uploadPath);
    // wx.showLoading({ title: uploadPath||"翻译中...", mask: false });
    xy.checkImageSync({
      tempFilePaths: uploadPath,
      instance: null,
      success: (imgRes) => {  
        // wx.hideLoading(); 
        //  imgRes['url']="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg"
              console.warn("confirmImginfo:takePicture::imgRes::",uploadPath,imgRes,new Date()) 
              app.globalData.totalUploadImages.push(imgRes.url);
              app.globalData.currentUploadImages=app.globalData.currentUploadImages+1;
               console.log(new Date())
              resolve(imgRes.url);  
      },
      fail: (err) => {
        console.error("checkImageSync::err___");
        wx.hideLoading();
        xy.showTip(err);   
        reject(err);
      },
    });
  });
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbarWidthStatus: app.globalData.navbarWidthStatus, //导航栏+状态栏
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuHeight: app.globalData.menuHeight, //导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度 
    notVip: false,  
    isuploading:false,
    maxlength: 2000,
    isIOS: sys.system.indexOf('iOS') > -1,
    subscribe: app.globalData.subscribe || {},
    imgUrlList:[],//临时图片地址
    imgList:[ //构造提供页面使用，均为临时路径，
      // {
      //   tempFilePath: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/1.jpeg",
      //   fileType: "image",
      //   size: "哄哄哄",
      // }
    ],
    uploadImgList:[],//上传的图片地址,用户可能频繁操作，所以节约服务器消耗
    selectedpic:""
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
  //   选择照片（（用户可能多次选择相同图片:后续添加一个本地图片md5校验的方法，排除重复图片），）
  takePicture(){
    let tThis= this;
    wx.chooseMedia({
        count: 10,
        mediaType: ["image"],
        sourceType: ["album"],
        maxDuration: 30,
        camera: 'back',
        success(res) { 
          console.warn("chooseMediachooseMedia",res) 
          const tempFiles = res.tempFiles;
          const imgUrlList =tThis.data.imgUrlList;
          tempFiles.forEach(function(item){
            imgUrlList.push(item.tempFilePath);
          });
          tThis.setData({
            imgList:tThis.data.imgList.concat(tempFiles),
            imgUrlList:imgUrlList
          })
          console.log("currentTotalImages",tThis.data.imgList,tThis.data.imgUrlList);
        },
        fail(res) {
          console.warn("cancel_fail::",res)  
        },
        complete(res) { 
          // this.setData({  
          //   selectPicturPath: ""
          // });
        },
      })
  }, 
  // 开始上传所以临时文件到服务器
  uploadMutipleImg(tempFilesArr,successCallback){ 
    wx.showLoading({ title:  "正在解析图片信息，服务器为您疯狂计算中...", mask: true });
    let tThis= this;
      tThis.setData({  
        isuploading:true, 
        tempFilesArr:tempFilesArr
      });
      app.totalUploadImages=tempFilesArr;

      clearInterval(app.globalData.globalTimer);
      app.globalData.globalTimer=null; 
    //  let resp= await confirmImginfo(res,res.tempFiles[0]['tempFilePath']);
    // 实时上传的进度提示
      if(tempFilesArr.length>1){ 
        app.globalData.globalTimer =setInterval(function(){ 
          console.warn("tempFilesArr.length>1",tempFilesArr,new Date());
          const info = "上传中"+ (app.globalData.currentUploadImages+1)+"/"+(tempFilesArr.length);
          wx.showLoading({ title: info, mask: true }); 
          },500);
        }
     Promise.all(tempFilesArr.map(confirmImginfo)).then(uploadImgsUrls => {  
      console.warn("uploadMutipleImg:uploadImgsUrls:"+uploadImgsUrls,new Date());
      app.globalData.totalUploadImages=[];
      app.globalData.currentUploadImages=0;
      clearInterval(app.globalData.globalTimer);
      app.globalData.globalTimer=null;
        tThis.setData({ 
            uploadImgList:uploadImgsUrls
        });
        successCallback&&successCallback(uploadImgsUrls);
      })
      .catch(error => {      
        console.error('An error occurred while uploading images:', error);
        clearInterval(app.globalData.globalTimer);
        curentLoading=null;
        app.showModalClose("请稍后在尝试，图片校验失败",2000);
      });

      // setTimeout(function(){ 
      // },2000);
  },
  // 删除指定临时上传的图片
  removeImage(e){ 
    const { path } = e.currentTarget.dataset;
    console.warn("removeImage：path"); 
    console.warn(e);  
    // 删除图片地址已经更新图片地址结构体
    const updateImgalist=this.data.imgList.filter(function(item){

      return item.tempFilePath!=path;
    });
    const updateImgaUrls=this.data.imgUrlList.filter(function(item){

      return item!=path;
    })
    this.setData({
        imgList:updateImgalist,
        imgUrlList:updateImgaUrls,
        selectedpic:path==this.data.selectedpic?"":this.data.selectedpic,
        }) 
  },
  // 记录当前选择
  translateCurrent(e){ 
    const { path } = e.currentTarget.dataset;
    console.warn("path",path);  
    this.setData({
        selectedpic:path 
      });
        
    wx.previewImage({
      urls:this.data.imgUrlList,
      current: path,
      success:function(){
        console.warn("previewImage",path);  

      },
      fail:function(){
        console.warn("previewImage:failss",path);  
        
      }
    });
  },
  // 翻译文件，批量上传操作，此操作消耗性能，（后续添加一个本地图片md5校验的方法，排除重复图片）
  goToTranslate(e){
    
    console.warn("path");  
    if(this.data.imgList.length==0){ 
      app.showModalClose("请上传图片后操作",2000);
      return false;
    }
    wx.showLoading({ title:  "正在解析图片信息，服务器为您疯狂计算中...", mask: true });
    this.uploadMutipleImg(this.data.imgUrlList,function(uploadImgLists){ 
      app.totalUploadImages=[];
      app.currentUploadImages=0;
      wx.setStorageSync('currentTranslateImags', uploadImgLists) 
        wx.navigateTo({
          url: "../indexpicture/index?selectPicturPath="+uploadImgLists.join("---")+"&ismultiple=1"
        })
    })
    
                
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){  
    app.getCurrentLang(this);
    if (app.globalData.access_token) {
      this.setData({
        subscribe: app.globalData.subscribe || {},
        notVip: !app.globalData.subscribe.is_vip
      })
    } else {
      app.userCenterLoginCallbackIndex = () => {
        this.setData({
          subscribe: app.globalData.subscribe || {},
          notVip: !app.globalData.subscribe.is_vip
        })
      };
    }
    // 注册pay组件
    this.payComponent = this.selectComponent("#pay");
    // xy.setClipboardData("少小离家老大回人之初性本善");
    // 判断是否存在用户图片
    if(options.imgupload){
      const tempFilesArr=[];
      const imgUrlList=options.imgupload.split("---");
      imgUrlList.forEach(function(item){ 
        tempFilesArr.push({
          tempFilePath:item
        });
      }); 
      // 储存临时文件即可，最后一次性上传
      this.setData({
        imgList:tempFilesArr,
        imgUrlList:imgUrlList,
      }); 
      // const tThis=this;
      // app.globalLogin(this,function(){
        // tempFilesArr.length&&tThis.uploadMutipleImg(tempFilesArr);
      // });
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