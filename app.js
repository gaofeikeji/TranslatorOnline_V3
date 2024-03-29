// app.js
import * as xy from "./utils/common.js";

App({   
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    introduceUrl: "",
    toText: "",
    image_txt: "",
    h5_url: "",
    countAd: wx.getStorageSync("countAd") || 0,
    inputAd: 0,
    isVip: false,
    access_token: null,
    x_access_token: null,
    currentNetwork: null,
    globalHost: "https://translate.mp.lighthg.com",
    langData: {
      "auto": "自动",
      "zh": "中文",
      "en": "英语",
      "fr": "法语",
      "ja": "日语",
      "ko": "韩语",
      "de": "德语",
      "es": "西班牙语",
      "sq": "阿尔巴尼亚语",
      "ar": "阿拉伯语",
      "am": "阿姆哈拉语",
      "acu": "阿丘雅语",
      "agr": "阿瓜鲁纳语",
      "ake": "阿卡瓦伊语",
      "amu": "阿穆斯戈语",
      "az": "阿塞拜疆语",
      "ga": "爱尔兰语",
      "et": "爱沙尼亚语",
      "ee": "埃维语"
      },  

    navBarHeight: 0,     // 导航栏高度
    menuBotton: 0,       // 胶囊距底部间距（保持底部间距一致）
    menuRight: 0,        // 胶囊距右方间距（方保持左、右间距一致）
    menuHeight: 0,       // 胶囊高度（自定义内容可与胶囊高度保证一致）
    statusBarHeight: 0,       // 状态栏高度
    screenHeight: 0,       // 可视区域高度
    currentLang:wx.getStorageSync("currentLang")||"auto",
    currentTargetLang:wx.getStorageSync("currentTargetLang")||"en",
    selectPicturPath:"https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg",
    totalUploadImages:[],
    currentUploadImages:0,
    isMobile: false,
    currentPictureInfoCount: 0,
    globalTimer:null
 
  },
  onLaunch: function () { 
    // 统一导航样式
    this.setNavBarInfo();
    // this.globalLogin();
  },
  
  setNavBarInfo() {
      
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
      this.globalData.isMobile=true;
    } else if (systemInfo.platform === 'windows' || systemInfo.platform === 'mac') {
    } else {
    }
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    const menuButtonToStatus = (menuButtonInfo.top - systemInfo.statusBarHeight/2); 
    this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height+10;
    this.globalData.navbarWidthStatus = this.globalData.navBarHeight+systemInfo.statusBarHeight;
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuLeftwidth = menuButtonInfo.left;
    this.globalData.screenWidth = systemInfo.screenWidth;
    this.globalData.screenHeight = systemInfo.screenHeight-this.globalData.navbarWidthStatus;
    console.error(systemInfo,menuButtonInfo,this.globalData.navBarHeight,this.globalData.navbarWidthStatus);
 },
  //带定时器的loading
  showModalClose(text,during){ 
        wx.showLoading({ title: text||"请按照使用说明操作", mask: true });
        if(during){
          setTimeout(function(){
            wx.hideLoading();
          },during); 
        }
  }, 
  // 获取语言配置
  getLangConfig(callback) { 
    wx.request({
      url: this.globalData.globalHost + "/api/translate/language",
      method: "GET",
      header: {
        "content-type": "application/json",
        Authorization: wx.getStorageSync("access_token"),
      },
      success: (res) => {
        if (res.data.code == 1) {
          let lang = res.data.data; 
          wx.setStorageSync("langData", lang);  
          typeof callback === "function" && callback(lang);
        } else {
          wx.showToast({ title: res.data.msg, icon: "none" });
        }
      },
      fail: (err) => {
        //console.log(err);
      },
    });
  },
  getCurrentLang(tThis,instance){ 
    const currentLang=wx.getStorageSync("currentLang")||"auto";
    const currentTargetLang=wx.getStorageSync("currentTargetLang")||"zh";
    const current=  {
        currentLang: currentLang,
        currentTargetLang: currentTargetLang, 
      };
    tThis&&tThis.setData(current)
    return current;
  },
  updateGlobalLang(updateLang,updateTargetLang){
    
    // this.globalData.currentLang=updateLang;// 
    // this.globalData.currentTargetLang=currentTargetLang;// 
    wx.setStorageSync("currentLang", updateLang); 
    wx.setStorageSync("currentTargetLang", updateTargetLang);  
    return {
      currentLang:updateLang,
      currentTargetLang:updateTargetLang
    }
  },
  globalLogin(tThis,customeCall){ 
      tThis = tThis||this;
      let currentInstance=this;
      //console.log("globalLoginglobalLogin",this.globalData);
    // 用户中心access_token
    if (!this.globalData.access_token) {
      xy.userLogin((data) => {
        currentInstance.globalData.access_token = data.token;
        currentInstance.globalData.subscribe = data.subscribe;
        currentInstance.userCenterLoginCallbackOnClickVipLock  && currentInstance.userCenterLoginCallbackOnClickVipLock();
        currentInstance.globalData.userInfo = {
          nickname: data.nickname,
          avatar: data.avatar,
        };
        tThis.setData({
          notVip: data.subscribe.is_vip
        }) 
        currentInstance.globalData.introduceUrl = data.introduceUrl || "";
        wx.setStorageSync("USER_INFO", data);
        currentInstance.userCenterLoginCallbackIndex&&currentInstance.userCenterLoginCallbackIndex();
        // 添加自定义回调事件 

      });
    }else{
      
      //console.log("globalLoginglobalLogin",this.globalData);
      currentInstance.userCenterLoginCallbackIndex = () => {
        //console.log('app.globalData.subscribe.is_vip', app.globalData.subscribe)
        tThis.setData({
          notVip: !app.globalData.subscribe.is_vip
        }); 
        customeCall&&customeCall(data,currentInstance);
      };
      //此事件会被上面异步操作覆盖（如果时间也存在异步操作请求浪费资源不建议添加回调，使用promise）
      customeCall&&customeCall({},currentInstance);
    } 
    tThis&&this.getCurrentLang(tThis);


    // 图片提取文字 token
    if (!this.globalData.x_access_token) {
      this.getAccessToken((token) => (this.globalData.x_access_token = token));
    }

    // 获取当前网络状态
    xy.getNetworkStatus((e) => (this.globalData.currentNetwork = e)); 
  }, 
  userCenterLogin(){ 
    const tThis =  this;
    xy.userLogin((data) => {
      tThis.globalData.access_token = data.token;
      tThis.globalData.subscribe = data.subscribe;
      tThis.userCenterLoginCallbackOnClickVipLock  && tThis.userCenterLoginCallbackOnClickVipLock();

      tThis.globalData.userInfo = {
        nickname: data.nickname,
        avatar: data.avatar,
      };
      tThis.globalData.introduceUrl = data.introduceUrl || "";
      wx.setStorageSync("USER_INFO", data);
      tThis.userCenterLoginCallbackIndex&&tThis.userCenterLoginCallbackIndex();
      tThis.userCenterLoginCallbackUserMember&&tThis.userCenterLoginCallbackUserMember();
    });
  },
  getImageInfo(img,callbak){
     wx.getImageInfo({
      src: 'images/a.jpg',
      success (res) {
        // console.log(res.width,res.height) 
        callbak&&callbak(res);
      },
      fail (res) {
        console.log("getImageInfo:") 
      }
    })
  },
  // 获取文字提取token
  getAccessToken(cb) {
    wx.request({
      url: this.globalData.hostUrl + "/oauth/2.0/token",
      data: {
        grant_type: "client_credentials",
        client_id: "qcXBy6sbcpTnOLYNsmishjex",
        client_secret: "Inn2TFM6xhSgKHyQGrCFn3xS3rceFHGK",
      },
      success: (res) => {
        typeof cb == "function" && cb(res.data.access_token);
      },
    });
  },
  verifyImage: function (url) {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.hostUrl + "/api/mini_api/image_check",
        method: "POST",
        header: {
          Authorization: this.globalData.access_token,
        },
        data: {
          url: url,
        },
        success: (res) => {
          resolve(res.data);
        },
        reject: (err) => reject(err),
      });
    });
  },
  // 图片安全检测
  checkImage: function (data, callback) {
    this.uploadFile(data)
      .then((res) => {
        if (res.code == 1) {
          return res.data.url;
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        }
      })
      .then((url) => {
        this.verifyImage(url).then((res) => {
          if (res.code == 1) {
            this.globalData.image_url = url;
            callback();
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          }
        });
      })
      .catch((err) => {
        wx.showToast({
          title: err,
          icon: "none",
          duration: 2000
        });
      });
  },
  // 上传文件
  uploadFile(data) {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: xy.isDevelopmentStatusUrl() + "/api/upload/store",
        filePath: data.filePath,
        name: "file",
        header: {
          Authorization: wx.getStorageSync("access_token"),
        },
        formData: {
          type: data.type,
        },
        success: function (res) {
          //console.log("上传成功", res);
          let resData = JSON.parse(res.data);
          resolve(resData);
        },
        fail: function (err) {
          wx.hideLoading();
          //console.log("上传失败", err);
          reject(err);
        },
      });
    });
  },   

  // 更新用户信息
  updateUserInfo(userInfo) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.request(
          xy.isDevelopmentStatusUrl() + "/api/user/update", {
          nickname: userInfo.nickname,
          avatar_url: userInfo.avatar_url,
        },
          "POST"
        )
        .then((res) => {
          if (res.code == 1) {
            that.globalData.userInfo = res.data.user_info;
            wx.setStorageSync("USER_INFO", res.data.user_info);
            resolve(res);
          }
          resolve(res);
        });
    });
  },
  // 基础请求
  AppRequest(url, data = {}, method = "GET") {
    let that = this;
    return new Promise((resolve, reject) => {

      wx.request({
        url: xy.isDevelopmentStatusUrl() + url,
        method: method,
        data: data,
        header: {
          Authorization: wx.getStorageSync("access_token"),
          // 'content-type': 'application/json',
        },
        success: (res) => {
          if (res.data.code == 1) {
            resolve(res.data);
          } else {
            reject(res.data.msg);
            //console.log("请求失败", res.data.msg);
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2000,
            });
          }
        },
        fail: (err) => {
          reject();

          wx.showToast({
            title: "网络错误",
            icon: "none",
            duration: 2000,
          });
        },
      });
    });
  },
  dowloadFile(text,api,customerFilename){
    //
    const req= this.request(api,{
      text:text
    },"POST");
    req.then(function(data){
        // console.warn("dowloadWord:",data,data.data.url)
        const downloadTask = wx.downloadFile({
        url:data.data.url,
        timeout:6000,
        success (res) { 
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          // console.warn("wx.downloadFile:success",res)
          if (res.statusCode === 200) { 
              wx.showModal({
                title: '下载提示',
                content: '是否保存文件到本地',
                success (savaRes) {
                  if (savaRes.confirm) {
                    //console.log('用户点击确定')
                    wx.shareFileMessage({
                      filePath: res.tempFilePath,
                      fileName: customerFilename||"中英文线上拍照翻译器最新",
                      success() {},
                      fail: console.error,
                    })
                  } else if (savaRes.cancel) {
                    wx.showToast({
                      title: "您已经取消下载……",
                      icon: "none",
                      duration: 2000,
                    });
                  }
                }
              }) 
          }else{

          }
        }, 
        fail (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          // console.warn("wx.downloadFile:fail",res) 
          wx.showToast({
            title: "下载失败请稍后重试",
            icon: "none",
            duration: 2000,
          });
        }
      });
      downloadTask.onProgressUpdate((res) => { 
      })
      
      // downloadTask.abort() // 取消下载任务
    })
  },
  dowloadExcel(){

  },
  dowloadTxt(){

  },
  // 通用请求
  request(url, data = {}, method = "GET") {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url:this.globalData.globalHost+ url,
        // url:"https://translate.mp.lighthg.com"+ url,
        method: method,
        data: data,
        header: {
          Authorization: that.globalData.access_token,
          // 'content-type': 'application/json',
        },
        success: (res) => {
          if (res.data.code == 1) {
            resolve(res.data);
          } else {
            reject(res.data.msg);
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2000,
            });
          }
        },
        fail: (err) => {
          reject();
          wx.showToast({
            title: "网络错误",
            icon: "none",
            duration: 2000,
          });
        },
      });
    });
  },
  // 申请相机权限
  requestCameraSystemPower(){ 
    wx.authorize({
      scope: 'scope.camera',
      success(res) {
        // 用户已授权，可以调用相机相关的API
          console.warn("confirmImginfoconfirmImginfo::","用户已授权，可以调用相机相关的API") 
          
      },
      fail() {
        // 用户拒绝授权或无权限，可以提示用户去设置中开启权限
          console.warn("confirmImginfoconfirmImginfo::","用户拒绝授权或无权限，可以提示用户去设置中开启权限") 
          wx.showModal({
            title: '提示',
            content: '请前往系统配置打开相机权限享受更佳的体验',
            success (res) {
              if (res.confirm) {
                //console.log('用户点击确定')
              } else if (res.cancel) {
                //console.log('用户点击取消')
              }
            }
          })
      }
    })
  }
   
})
