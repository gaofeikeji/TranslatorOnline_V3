// pages/text/index.js

import * as xy from "../../utils/common.js";
const sys = wx.getSystemInfoSync();
const app = getApp();

  // 检查图片校验并上传 
export const confirmImginfo = (uploadPath) => {
  console.warn("confirmImginforesresres",uploadPath);
  return new Promise((resolve, reject) => { 
    wx.showLoading({ title: uploadPath||"翻译中...", mask: false });
    xy.checkImageSync({
      tempFilePaths: uploadPath,
      instance: null,
      success: (imgRes) => {  
        wx.hideLoading();
        //  imgRes['url']="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg"
              console.warn("takePicture::imgRes::",imgRes) 
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
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuHeight: app.globalData.menuHeight, //导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度 
    notVip: false,  
    isuploading:false,
    maxlength: 2000,
    isIOS: sys.system.indexOf('iOS') > -1,
    subscribe: app.globalData.subscribe || {},
    imgUrlList:[],
    imgList:[ 
      // {
      //   tempFilePath: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/1.jpeg",
      //   fileType: "image",
      //   size: "哄哄哄",
      // }
    ],
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
  // 粘贴和清空 
  textFun(e) {
    const tThis=this;
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn("textFun", actype); 
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
      console.warn("fromText::",
      resp,wx.getStorageSync("currentTargetLang"), wx.getStorageSync("currentLang")); 
      if(resp!=""){ 
        wx.navigateTo({
          url: "/pages/texttranslate/index?text="+resp
        })
      }else{
        app.showModalClose("请填写要翻译的内容",3000);
      }
    }
    // this.setData({
    //   currentSelectY: top, 
    //   scale:1
    //   })
},  
//   选择照片
takePicture(){
  let tThis= this;
  wx.chooseMedia({
      count: 10,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      maxDuration: 30,
      camera: 'back',
      success(res) { 
        // wx.setStorageSync('upload_pic_info', res) 
        console.warn("chooseMediachooseMedia")
        console.warn(res)
        // wx.navigateTo({
        //   url: "/pages/indexpicture/index?selectPicturPath=https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg&height=1200&width=800"
        // })
        const tempFiles = res.tempFiles;
        tThis.uploadMutipleImg(tempFiles);
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
 uploadMutipleImg(tempFiles){ 
  let tThis= this;
    tThis.setData({  
      isuploading:true, 
      tempFiles:tempFiles
    });
    let tempFilesArr=[];
    for(let i=0;i<tempFiles.length;i++){
      tempFilesArr.push(tempFiles[i]['tempFilePath']);
    }
  //  let resp= await confirmImginfo(res,res.tempFiles[0]['tempFilePath']);
  Promise.all(tempFilesArr.map(confirmImginfo))
    .then(results => {
      console.log('All images uploaded successfully:', results);
      let imgObj=[];
      results.forEach(function(item,index){
        imgObj.push({
          tempFilePath:item,
          type:"image"
        });
      });
      tThis.setData({
          imgList:imgObj,
          imgUrlList:results,
          }) 
    })
    .catch(error => {
      console.error('An error occurred while uploading images:', error);
    });
},
// 删除上传的图片
removeImage(e){ 
  const { path } = e.currentTarget.dataset;
  console.warn("removeImage：path"); 
  console.warn(e);  
  const updateImgalist=this.data.imgList.filter(function(item){

    return item.tempFilePath!=path
  })
  this.setData({
      imgList:updateImgalist,
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
    urls: [this.data.imgUrlList],
    current: path,
    success:function(){
      console.warn("previewImage",path);  

    },
    fail:function(){
      console.warn("previewImage:failss",path);  
      
    }
  });
},
// 翻译文件
goToTranslate(e){
  
  console.warn("path");  
   if(this.data.imgList.length==0){ 
    app.showModalClose("请上传图片后操作",2000);
    return false;
   }
   wx.showLoading({ title: path||"翻译中...", mask: false });
   let imgObj=[];
   this.data.imgList.forEach(function(item,index){
     imgObj.push(item.tempFilePath);
   });
 
   wx.navigateTo({
     url: "../indexpicture/index?selectPicturPath="+imgObj.join("---")+"&ismultiple=1"
   })
  // wx.setStorageSync('upload_pic_info', netImginfo) 
  
  console.warn("path");  
  const path=this.data.selectedpic;
  const tThis=this;
  wx.getImageInfo({
    src: path,
    success (tempinfo) { 
      tThis.setData({  
        ccWidth:tempinfo.width,
        ccHeight:  tempinfo.height, 
      }); 
      
      wx.navigateTo({
        url: "../indexpicture/index?selectPicturPath="+path+"&ismultiple=1&height="+tempinfo.height+"&width="+tempinfo.width+"&ccheight="+tThis.data.height+"&ccwidth="+tThis.data.width
      })
        
    },fail(){
      app.showModalClose("获取图片信息失败，请重新上传",2000)
      wx.hideLoading()
    }
  })           
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){ 
    // 注册pay组件
    this.payComponent = this.selectComponent("#pay");
    // xy.setClipboardData("少小离家老大回人之初性本善");
    // 判断是否存在用户图片
    if(options.imgupload){
      const tempFilesArr=[];
      options.imgupload.split("---").forEach(function(item){ 
        tempFilesArr.push({
          tempFilePath:item
        });
      }); 
      this.setData({
        imgList:tempFilesArr
      }); 
      const tThis=this;
      app.globalLogin(this,function(){
        app.getCurrentLang(tThis);
        tempFilesArr.length&&tThis.uploadMutipleImg(tempFilesArr);
      });
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
    if (app.globalData.access_token) {
      this.setData({
        subscribe: app.globalData.subscribe || {},
        maxlength: app.globalData.subscribe.is_vip ? 2000 : 200,
        notVip: !app.globalData.subscribe.is_vip
      })
    } else {
      app.userCenterLoginCallbackIndex = () => {
        this.setData({
          subscribe: app.globalData.subscribe || {},
          maxlength: app.globalData.subscribe.is_vip ? 2000 : 200,
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

  }
})