
var app = getApp();
import * as xy from "../../utils/common.js";
// 检查图片校验并上传 
export const asyncCheckImageInfomultiple = (uploadPath) => {
return new Promise((resolve, reject) => { 
  // wx.showLoading({ title: uploadPath||"翻译中...", mask: false });
  xy.checkImageSync({
    tempFilePaths: uploadPath,
    instance: null,
    success: (imgRes) => {  
      wx.hideLoading();
      //  imgRes['url']="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg"
            console.warn("takePicture::imgRes::",imgRes) 
            console.warn("asyncCheckImageInfomultiple",uploadPath,imgRes);
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
    navbarWidthStatus: app.globalData.navbarWidthStatus, //导航栏+状态栏
    navBarHeight: app.globalData.navBarHeight, //导航栏高度 
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度 
    notVip: false, 
    initCamral:false, 
    selectPicturPath:"",
    ccWidth:0,
    ccHeight:0,
    showSelectImg:false,
    navBarHeight: app.globalData.navBarHeight, 
    screenHeight: app.globalData.screenHeight, 
    sysInfo:{},
    
    select: 0, 
    list: [
      {
        "iconPath": "/images/picture.png",
        "pagePath": "/pages/index/index",
        "selectedIconPath": "/images/picture.png",
        "text": "传图翻译",
        "type":0,
        "notpage":1
      },
      {
        "iconPath": "/images/text.png",
        "pagePath": "/pages/text/index",
        "selectedIconPath": "/images/text.png",
        "text": "文本翻译",
        "type":0
      },
      {
          "iconPath": "/images/file.png",
          "pagePath": "/pages/multiplepic/index",
          "selectedIconPath": "/images/file.png",
          "text": "文件翻译",
          "type":-1,
        },
    
      {
        "iconPath": "/images/person.png",
        "pagePath": "/pages/my/index",
        "selectedIconPath": "/images/person.png",
        "text": "个人中心",
        "type":0
      }
    ],
  }, 
  
  // 页面切换
  selectPage(e) { 
    const { index, page, type,notpage } = e.currentTarget.dataset;
    if(notpage===1){ 
      // this.setData({
      //   showSelectImg:  this.data.showSelectImg?false:true
      // })
    const tThis=this;  
    wx.showActionSheet({
      itemList: ["从相册选择图片", "从聊天记录选择图片"],
      success: (e) => {
        if (e.tapIndex == 0) {
          tThis.takePicture();
        } else if (e.tapIndex == 1) {
          tThis.takePhotoWithMessage();
          // wx.previewImage({
          //   urls: [this.data.image_url],
          //   current: this.data.image_url,
          // });
        }
      },
      fail: (err) => {
        wx.showToast({ title: err, icon: "none" });
      },
    });
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
        tThis.systemCamaraPower(function(){ 
            const ctx = wx.createCameraContext();
            ctx.setZoom({
                zoom:0.5
            })
            wx.showLoading({ title: "翻译中...", mask: true });
            ctx.takePhoto({ 
              quality: 'low',//low    medium    high
              flash: "off",
            "frame-size": "medium",
              success: (res) => {
                  console.warn("takePhoto::",res) 
                  tThis.setData({ 
                    initCamral: false,
                    selectPicturPath: res.tempImagePath,
                  })   
                  tThis.confirmImginfoSingle(res,res.tempImagePath,0); 
              },
              error(e) {
                console.log(e.detail)
              }
            })
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
  // 相机权限校验
  systemCamaraPower(callBack){ 
    
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.cameraAuthorized) 
      if(res.cameraAuthorized){  
        callBack&&callBack();
      }else{
        wx.showModal({
          title: '友情提醒',
          content: '请先开启相机权限，开启后效果更佳……',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              // callBack&&callBack();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } catch (e) {
      // Do something when catch error
        this.setData({ 
          initCamral: false,
        })   
    }
  },
  onHide() {

  },
  onLoad(){    
    const tThis=this;
    app.globalLogin(this,function(){
      tThis.systemCamaraPower();
    });
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
          tThis.setData({  
            initCamral:false, 
            selectPicturPath: res.tempFiles&&res.tempFiles[0]['tempFilePath'],
          });
            console.warn("当前选中的照片，一张就上传::",res) 
          if(res.tempFiles.length>1){ 
            let tempFilesArr= [];
            res.tempFiles.forEach(function(item){ 
              tempFilesArr.push( item.tempFilePath);
            }); 
            setTimeout(function(){ 
                tThis.setData({ 
                  initCamral: true,
                  selectPicturPath: "",
                })   
                wx.navigateTo({
                  url: "../multiplepic/index?imgupload="+tempFilesArr.join("---")
                })
            },1000);
          }else{
            //單文件上傳(或者拍照)
              tThis.confirmImginfoSingle(res,res.tempFiles[0]['tempFilePath'],0); 
          } 
            
        
    
        },
        fail(res) {
          console.warn("cancel_fail::",res)  
          tThis.setData({  
            initCamral:true, 
          });
        },
        complete(res) { 
          tThis.setData({   
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
       Promise.all(tempFilesArr.map(asyncCheckImageInfomultiple))
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
confirmImginfoSingle(res,uploadPath,ismultiple=0){
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
      wx.showLoading({ title:"正在校验图片信息，请稍等", mask: false });
      
        xy.checkImageSync({
          tempFilePaths: uploadPath,
          instance: tThis,
          success: (imgRes) => {  
            wx.hideLoading();
            //  imgRes['url']="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg"
                  console.warn("takePicture::imgRes::",imgRes)
 
              tThis.setData({ 
                initCamral: true,
                selectPicturPath: "",
              })   
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
            tThis.confirmImginfoSingle(res,res.tempFiles[0]['path'],0); 
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

