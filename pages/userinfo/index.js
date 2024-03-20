import * as xy from "../../utils/common.js";
var app = getApp();
var t = "?x-oss-process=style/avatar";

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
  data: {
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuHeight: app.globalData.menuHeight, //导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
    screenHeight: app.globalData.screenHeight, //可视区域高度 
    screenHeight: 0,       // 可视区域高度
    checked: false,
    nickName: "",
    tempUrl: false,
    type: '',
    isUpdate: false,
    avatarUrl: "",
    submiting: false,
    avatar_index: 0,

    avatars: [{
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/1.jpeg",
      nickName: "哄哄哄"
    }, {
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/2.jpeg",
      nickName: "神经蛙"
    }, {
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/3.jpeg",
      nickName: "阿白白"
    }, {
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/4.jpeg",
      nickName: "momo"
    }, {
      avatarUrl: "https://jizhang-1253713495.file.myqcloud.com/miniprogram/avatar/5.jpeg",
      nickName: "欢乐马"
    }],
    canIUseUserFill: true,
    canIUseGetUserProfile: false
  },
  onLoad: function (options) {
    this.setData({
      nbTitle: '设置头像和昵称', 
    })
   
    if(getApp().globalData.access_token){
      this.setData({ subscribe: getApp().globalData.subscribe || {} });
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }else{
      getApp().userCenterLoginCallbackSubscribe = () => {
        this.setData({ subscribe: getApp().globalData.subscribe || {} });
        this.setData({
          userInfo: app.globalData.userInfo,
        })
      }
    }
    const { type } = options
    if (type === 'update') {
      this.setData({ isUpdate: true })
    }

    const userInfo = wx.getStorageSync('USER_INFO') || {}
    if (Object.keys(userInfo).length) {
      const data = { nickName: userInfo.nickname, avatarUrl: userInfo.avatar }
      this.setData(data)
    }
  },
  changeRadio: function () {
    this.setData({
      checked: !this.data.checked
    })
    wx.vibrateShort && wx.vibrateShort({
      type: "medium"
    })
  },
  randomAvatar: function () {
    this.data.avatar_index++, this.data.avatar_index === this.data.avatars.length && (this.data.avatar_index = 0),
      this.setData({
        tempUrl: false,
        avatarUrl: this.data.avatars[this.data.avatar_index].avatarUrl,
        nickName: this.data.avatars[this.data.avatar_index].nickName
      });
  },
  onChooseAvatar: async function (e) {
    let tThis=this;
    let imageUrl = e.detail.avatarUrl;
    wx.getImageInfo({
      src: imageUrl,
      success: (event) => {
        console.log("evnet:ok", event)
        if (wx.cropImage && event.width !== event.height) {
          wx.cropImage({
            src: imageUrl,
            cropScale: "1:1",
            success: (evt) => {
              wx.showLoading({ title: '上传中...', mask: true })
              // app.uploadFile( { type: 'avatars', filePath: imageUrl }).then(res => {
              //   // let resData = JSON.parse(res);
              //   console.warn("resresres",res);
              //   tThis.setData({
              //     // avatarUrl: resData.data.url,
              //     avatarUrl: res,
              //     tempUrl: true
              //   })
              //   wx.hideLoading()
              // })
              confirmImginfo(imageUrl).then(function(userInfos){
                console.warn("cropImagecropImage",userInfos);
                tThis.setData({
                    // avatarUrl: resData.data.url,
                    avatarUrl: userInfos,
                    tempUrl: true
                  })
              })
              .catch(error => { 
                  wx.showToast({
                    title: "头像更新失败",
                    icon: "error"
                  })
              })

            },
            fail: (err) => {
              wx.showToast({
                title: "头像更新失败",
                icon: "error"
              })
            },
          })
        } else {
          wx.showLoading({ title: '上传中...', mask: true });
          confirmImginfo(imageUrl).then(function(userInfos){
            console.warn("userInfosuserInfos",userInfos);
            tThis.setData({
                // avatarUrl: resData.data.url,
                avatarUrl: userInfos,
                tempUrl: true
              })
          })
          .catch(error => { 
              wx.showToast({
                title: "头像更新失败",
                icon: "error"
              })
          })
          

          // userInfos.then(function(res){ 
          //   console.log("userInfosuserInfos:",res);
          //     app.uploadFile({ type: 'avatars', filePath: res }).then(res => {
          //     // let resData = JSON.parse(res);

             
          //     wx.hideLoading()
          //   })
          // })
        }
      }
    })
  },
  submitInput: function (event) {
    this.data.nickName = event.detail.value;
  },
  submitChange: function (event) {
    this.data.nickName = event.detail.value;
  },
  formSubmit: async function (e) {
    if (!this.data.avatarUrl) {
      wx.showToast({ title: '请先设置头像', icon: 'none' })
      return
    }

    if (!this.data.nickName) {
      wx.showToast({ title: '请先输入昵称', icon: 'none' })
      return
    }

    const params = {
      nickname: this.data.nickName,
      avatar_url: this.data.avatarUrl
    }

    this.setData({ submiting: true }) 
    // await sleep(2000)

    wx.showLoading({ title: this.data.isUpdate ? '保存中...' : '登录中...', mask: true })

    xy.updateUserInfo(params)
      .then(res => {
        console.log("更新用户信息成功", res);
        wx.hideLoading()
        this.setData({ submiting: false })

        wx.showToast({ title: this.data.isUpdate ? res.msg : '登录成功', icon: 'success', mask: true })
        setTimeout(() => {
          wx.navigateBack({ delta: 1 })
        }, 1000) 
      }) 
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { }
});