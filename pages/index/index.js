
var app = getApp();
import * as xy from "../../utils/common.js";
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
// index.js
Page({ 
  data:{
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuBotton: app.globalData.menuBotton, //导航栏距离顶部距离
    menuRight: app.globalData.menuRight, //导航栏距离右侧距离
    menuHeight: app.globalData.menuHeight, //导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度 
    notVip: false,
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff', 
    initCamral:false, 
    select: 0, 
    selectPicturPath:"",
    ccWidth:0,
    ccHeight:0,
    showSelectImg:false,
    navBarHeight: app.globalData.navBarHeight, 
    screenHeight: app.globalData.screenHeight, 
    sysInfo:{},
    list: [
      {
        "iconPath": "data:image/png;base64,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",
        "pagePath": "/pages/index/index",
        "selectedIconPath": "data:image/png;base64,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",
        "text": "传图翻译",
        "type":0,
        "notpage":1
      },
      {
        "iconPath": "data:image/png;base64,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",
        "pagePath": "/pages/text/index",
        "selectedIconPath": "data:image/png;base64,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",
        "text": "文本翻译",
        "type":0
      },
      {
          "iconPath": "data:image/png;base64,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",
          "pagePath": "/pages/multiplepic/index",
          "selectedIconPath": "data:image/png;base64,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",
          "text": "文件翻译",
          "type":-1
        },
    
      {
        "iconPath": "data:image/png;base64,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",
        "pagePath": "/pages/my/index",
        "selectedIconPath": "data:image/png;base64,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",
        "text": "个人中心",
        "type":0
      }
    ],
  }, 
  // 页面切换
    selectPage(e) {
      // {
      //   "iconPath": "data:image/png;base64,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",
      //   "pagePath": "/pages/file/index",
      //   "selectedIconPath": "data:image/png;base64,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",
      //   "text": "文件翻译",
      //   "type":0
      // },
        const { index, page, type,notpage } = e.currentTarget.dataset;
        if(notpage===1){ 
          this.setData({
            showSelectImg:  this.data.showSelectImg?false:true
          })
          return false; 
        }
        if(type==-1){
          wx.showModal({
            title: '友情提示',
            content: '感谢您的使用，功能正在完善中，敬请期待……',
            complete: (res) => {
              if (res.cancel) {
                
              }
          
              if (res.confirm) {
                
              }
            }
          })
          return false;
        }
        console.warn(index, page, type ); 
        wx.navigateTo({
          url: page
        })
        // wx.switchTab({url:page})
        // this.setData({
        //   selected: index
        // })
    }, 
    //相机拍照接口
    takePhoto(){ 
        console.log("cam inited")  
        const tThis= this;
        const ctx = wx.createCameraContext();
        ctx.setZoom({
            zoom:0.5
        })
        wx.showLoading({ title: "翻译中...", mask: true });
        ctx.takePhoto({ 
          quality: 'high',
          success: (res) => {
              console.warn("takePhoto::",res) 
              tThis.confirmImginfo(res,res.tempImagePath,0); 
          }
        })
      },
      cam_inited(e){ 
        console.log("cam inited") 
      },
      cam_error(){
        console.warn("image-load- error")
        this.setData({ 
          initCamral: false
        })   
      },      
      initCamera(){
        console.warn("initCamera:");
        this.setData({ 
          initCamral: true,
        })   
      },
  methods: { 
  },
  onLoad(){   
    wx.setNavigationBarColor({
      frontColor: '#000',
      backgroundColor: '#000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    wx.setBackgroundColor({
      backgroundColorTop: '#ffffff', // 顶部窗口的背景色为白色
      backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
    })
    app.globalLogin(this,function(){

    });
    
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.cameraAuthorized) 
      if(res.cameraAuthorized){ 
      
      }
    } catch (e) {
      // Do something when catch error
        this.setData({ 
          initCamral: false,
        })   
    }
    app.getCurrentLang(this);

  },
  onShow(){ 
    console.warn("app.sysInfo::",app.sysInfo,wx.getSystemInfoSync(),);
    wx.showShareMenu({
      withShareTicket: true, // 是否使用带 shareTicket 的转发
      menus: ["shareAppMessage", "shareTimeline"], // 自定义分享菜单列表
    });
  }, 
  ready() {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { 
  },

  // 返回
  cancelPictureSelect() {
    this.setData({
      showSelectImg:  this.data.showSelectImg?false:true
    })
  },
//   选择照片
takePicture(){
  let tThis= this;
  wx.chooseMedia({
      count: 10,
      mediaType: ["image"],
      sourceType: ["album"],
      maxDuration: 30,
      camera: 'back',
      success(res) { 
        // wx.setStorageSync('upload_pic_info', res) 
        // console.warn(res)
        // wx.navigateTo({
        //   url: "/pages/indexpicture/index?selectPicturPath=https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg&height=1200&width=800"
        // })
        // return false; 
          console.warn("confirmImginfoconfirmImginfo::",res) 
        if(res.tempFiles.length>1){
          // const tempFiles = res.tempFiles; 
          let tempFilesArr= [];
          res.tempFiles.forEach(function(item){ 
            tempFilesArr.push( item.tempFilePath);
          }); 
          wx.navigateTo({
            url: "../multiplepic/index?imgupload="+tempFilesArr.join("---")
          })
        }else{
            tThis.confirmImginfo(res,res.tempFiles[0]['tempFilePath'],0); 
        } 
          
       
   
      },
      fail(res) {
        console.warn("cancel_fail::",res)  
      },
      complete(res) { 
        tThis.setData({  
          initCamral:true,
          showSelectImg:  false, 
          selectPicturPath: ""
        });
      },
    })
},  

//   选择照片
takePictureMultiple(){
  let tThis= this;
  wx.chooseMedia({
      count: 10,
      mediaType: ["image"],
      sourceType: ["album"],
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
          // let imgObj=[];
          // results.forEach(function(item,index){
          //   imgObj.push({
          //     tempFilePath:item,
          //     type:"image"
          //   });
          // }); 
              wx.navigateTo({
                url: "../indexpicture/index?selectPicturPath="+results.join("---")+"&ismultiple=1"
              })
        })
        .catch(error => {
          console.error('An error occurred while uploading images:', error);
        });
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
// 查看原图
viewImage() {
wx.showActionSheet({
  itemList: ["重新上传", "查看大图"],
  success: (e) => {
    this.takePhoto();
    // if (e.tapIndex == 0) {
    //   this.takePhoto();
    // } else if (e.tapIndex == 1) {
    //   wx.previewImage({
    //     urls: [this.data.image_url],
    //     current: this.data.image_url,
    //   });
    // }
  },
  fail: (err) => {
    wx.showToast({ title: err, icon: "none" });
  },
});
},
// 检查图片校验并上传
confirmImginfo(res,uploadPath,ismultiple=0){
  const tThis=this;
  tThis.setData({ 
      selectPicturPath:uploadPath
  })
  console.log("res.tempFiles[0].size:",res) 
  // return  false;
  wx.showLoading({ title: uploadPath||"翻译中...", mask: false });
  wx.getImageInfo({
    src: uploadPath,
    success (tempinfo) { 
      tThis.setData({  
        ccWidth:tempinfo.width,
        ccHeight:  tempinfo.height, 
      });
      console.log("res.tempinfotempinfo:",tempinfo,uploadPath) 
      wx.showLoading({ title: tempinfo.width||"res.tempinfotempinfo...", mask: false });
      
        xy.checkImageSync({
          tempFilePaths: uploadPath,
          instance: tThis,
          success: (imgRes) => {  
            wx.hideLoading();
            //  imgRes['url']="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg"
                  console.warn("takePicture::imgRes::",imgRes)

              tThis.setData({
                selectPicturPath: imgRes.url
              });
              app.globalData.selectPicturPath=imgRes.url;
              wx.getImageInfo({
                src: imgRes.url,
                success (netImginfo) {
                  // tThis.getPictureRate(res); 
                  console.log("getImageInfogetImageInfo:",netImginfo)
                  wx.setStorageSync('upload_pic_info', netImginfo) 
                
                  wx.navigateTo({
                    url: "../indexpicture/index?selectPicturPath="+imgRes.url+"&ismultipl="+ismultiple+"&height="+netImginfo.height+"&width="+netImginfo.width+"&ccheight="+tThis.data.height+"&ccwidth="+tThis.data.width
                  })
                },fail(){
                  app.showModalClose("获取图片信息失败，请重新上传",20000)
                  wx.hideLoading();
                }
              })
          },
          fail: (err) => {
            console.error("checkImageSync::err___");
            wx.hideLoading();
            xy.showTip(err.msg);  
          },
        });
    },fail(){
      app.showModalClose("获取图片信息失败，请重新上传",2000)
      wx.hideLoading()
    }
  })
},
//   选择照片
takePhotoWithMessage(){
    let tThis= this;
    wx.chooseMessageFile({
        count: 10,
        type: "image", 
        success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log("chooseMessageFile:",res) 
        if(res.tempFiles.length>1){
          // const tempFiles = res.tempFiles; 
          let tempFilesArr= [];
          res.tempFiles.forEach(function(item){ 
            tempFilesArr.push( item.path);
          }); 
          wx.navigateTo({
            url: "../multiplepic/index?imgupload="+tempFilesArr.join("---")
          })
        }else{
            tThis.confirmImginfo(res,res.tempFiles[0]['path'],0); 
        }
        },
        fail(res) {
          console.warn("cancel_fail::",res)  
          wx.hideLoading()
          app.showModalClose(res,2000)
        },
        complete(res) { 
          wx.hideLoading()
          tThis.setData({  
            initCamral:true,
            showSelectImg:  false, 
            selectPicturPath: ""
          });
        },
    })
}, 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { 
  },
  textTranslation(){
    wx.navigateTo({
      url: '/pages/main/index',
    })
  },
  imageTranslation() {
    wx.navigateTo({
      url: '/pages/picture/index',
    })
  },
  // 分享内容
  onShareAppMessage: function () {
    return {
      title: "终生免费，无限制。1秒搞定",
      path: "/pages/index/index",
      imageUrl: "/images/index_png.png"
    };
  },
})

