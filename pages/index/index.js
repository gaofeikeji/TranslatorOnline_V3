
var app = getApp();
// index.js
Page({ 
  data:{
    notVip: false,
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff', 
    initCamral:false,
    select: 0, 
   
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
  methods: {
    error(){
      console.warn("image-load- error")
    },
    cam_inited(e){ 
      console.log("cam inited")
    },
    takePhoto(){ 
      console.log("cam inited")
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          this.setData({
            src: res.tempImagePath
          })
        }
      })
    }
   
  },
  onLoad(){
    this.setData({
      nbTitle: '主页',
      nbLoading: false,
      nbFrontColor: '#ffffff',
      nbBackgroundColor: '#000000',
    })
    this.setData({
      initCamral: true
    })
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

