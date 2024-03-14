
var app = getApp();
import * as xy from "../../utils/common.js";
// index.js
Page({ 
  data:{
    notVip: false,
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff', 
    initCamral:true,
    select: 0, 
    selectPicturPath:"/images/bg/bg-dark.png",
    ccWidth:0,
    ccHeight:0,
    list: [
      {
        "iconPath": "/images/picture_translate.png",
        "pagePath": "/pages/index/index",
        "selectedIconPath": "/images/picture_translate.png",
        "text": "传图翻译",
        "type":0
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
        const { index, page, type } = e.currentTarget.dataset;
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
   test(){}
  },
  onLoad(){
    this.setData({
      nbTitle: '主页',
      nbLoading: false, 
    })  
    this.setData({ 
      initCamral: true
    })
    app.globalData.requireBack=false; //首页不需要返回功能
    console.warn("onLoad:app.globalData.requireBack",app.globalData.requireBack)
  },
  onShow(){
    app.globalData.requireBack=false; //首页不需要返回功能
    console.warn("onShow:app.globalData.requireBack",app.globalData.requireBack)
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
    app.globalData.requireBack=true; //首页不需要返回功能
    console.warn("onHide:app.globalData.requireBack",app.globalData.requireBack)

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    app.globalData.requireBack=true; //首页不需要返回功能
    console.warn("onUnload:app.globalData.requireBack",app.globalData.requireBack)
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

