
var app = getApp();
import * as xy from "../../utils/common.js";
// index.js
Page({ 
  data:{
    notVip: false,
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff', 
    initCamral:false, 
    select: 0, 
    selectPicturPath:"/images/bg/bg-dark.png",
    ccWidth:0,
    ccHeight:0,
    showSelectImg:false,
    list: [
      {
        "iconPath": "/images/picture_translate.png",
        "pagePath": "/pages/index/index",
        "selectedIconPath": "/images/picture_translate.png",
        "text": "传图翻译",
        "type":0,
        "notpage":1
      },
      {
        "iconPath": "/images/text_translate.png",
        "pagePath": "/pages/text/index",
        "selectedIconPath": "images/text_translate.png",
        "text": "文本翻译",
        "type":0
      },
      {
        "iconPath": "/images/file_translate.png",
        "pagePath": "/pages/file/index",
        "selectedIconPath": "/images/file_translate.png",
        "text": "文件翻译",
        "type":0
      },
      {
        "iconPath": "/images/personal.png",
        "pagePath": "/pages/personal/index",
        "selectedIconPath": "/images/personal.png",
        "text": "个人中心",
        "type":0
      }
    ],
  }, 
  // 页面切换
    selectPage(e) {
        const { index, page, type,notpage } = e.currentTarget.dataset;
        if(notpage===1){ 
          this.setData({
            showSelectImg:  this.data.showSelectImg?false:true
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
    //拍照
    takePhoto(){ 
        console.log("cam inited") 
        //           //模拟图片 
        //           this.setData({
        //             selectPicturPath: "https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg",
        //             initCamral:false
        //           })
        //           app.globalData.selectPicturPath="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg";
        //           wx.navigateTo({
        //             url: "/pages/indexpicture/index"
        //           })
        // return false;
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
              xy.checkImageSync({
                tempFilePaths: res.tempImagePath,
                instance: tThis,
                success: (imgRes) => { 
                  
                   wx.hideLoading();
                  console.warn("imgRes::",imgRes)
                    tThis.setData({
                      selectPicturPath: imgRes.url,
                      initCamral:false
                    })
                    app.globalData.selectPicturPath=imgRes.url;
                    wx.navigateTo({
                      url: "/pages/indexpicture/index"
                    })
                },
                fail: (err) => {
                  wx.hideLoading();
                  xy.showTip(err.msg);
                },
              });
          }
        })
      },
      cam_inited(e){ 
        console.log("cam inited")
      },
      cam_error(){
        console.warn("image-load- error")
      },      
  methods: { 
    initCamera(){
      this.setData({ 
        initCamral: true,
      })   
    },
  },
  onLoad(){
    app.getCurrentLang(this);
  },
  onShow(){ 
    wx.showShareMenu({
      withShareTicket: true, // 是否使用带 shareTicket 的转发
      menus: ["shareAppMessage", "shareTimeline"], // 自定义分享菜单列表
    });
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
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        const uploadPath = res.tempFiles[0]['tempFilePath']
        tThis.setData({ 
            selectPicturPath:uploadPath
        })
        console.log(res)
        console.log(res.tempFiles[0].size)
        // return  false;
        wx.showLoading({ title: "翻译中...", mask: true });
        xy.checkImageSync({
          tempFilePaths: uploadPath,
          instance: tThis,
          success: (imgRes) => {  
             wx.hideLoading();
            console.warn("imgRes::",imgRes)
              tThis.setData({
                selectPicturPath: imgRes.url,
                initCamral:false
              });
              app.globalData.selectPicturPath=imgRes.url;
              wx.navigateTo({
                url: "/pages/indexpicture/index"
              })
          },
          fail: (err) => {
            wx.hideLoading();
            xy.showTip(err.msg);
          },
        });
      },
      fail(res) {
        console.warn("cancel_fail::",res)
        // wx.navigateTo({
        //   url: "/pages/indexpicture/index"
        // })
      },
      complete(res) {
        console.error(res)
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
//   选择照片
takePhotoWithMessage(){
    let tThis= this;
    wx.chooseMessageFile({
        count: 1,
        type: 'image',
        success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        console.log(res.tempFiles.size)
        tThis.setData({
            selectPicturPath:res.tempFiles[0]['tempFilePath']
        })
        }
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

