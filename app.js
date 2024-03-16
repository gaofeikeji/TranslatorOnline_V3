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
    url: "https://imgconvert.mp.lighthg.com",
    apiUrl: "https://aip.baidubce.com",  
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
    selectPicturPath:"https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg"
 
  },
  onLaunch: function () { 
    // 统一导航样式
    this.setNavBarInfo();
    this.globalLogin();
  },
  //带定时器的loading
  showModalClose(text,during){ 
  wx.showLoading({ title: text||"请按照使用说明操作", mask: true });
  setTimeout(function(){
    wx.hideLoading();
  },during);
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
          let langArr = [];
          let codeArr = [];
          // langArr.push('请选择')
          for (let i in lang) {
            langArr.push(lang[i]);
            codeArr.push(i);
          } 
          wx.setStorageSync("langData", lang);  
          typeof callback === "function" && callback(res.data.data);
        } else {
          wx.showToast({ title: res.data.msg, icon: "none" });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  getCurrentLang(tThis){ 
    this.globalData.currentLang=wx.getStorageSync("currentLang")||"auto";
    this.globalData.currentTargetLang=wx.getStorageSync("currentTargetLang")||"en";
    const current=  {
        currentLang: this.globalData.currentLang,
        currentTargetLang: this.globalData.currentTargetLang, 
      };
    tThis&&tThis.setData(current)
    return current
  },
  updateGlobalLang(updateLang,updateTargetLang){
    
    wx.setStorage("currentLang", updateLang); 
    wx.setStorage("currentTargetLang", updateTargetLang); 
    console.warn("updateGlobalLang::",wx.getStorageSync("currentTargetLang"), wx.getStorageSync("currentLang")); 
  },
  globalLogin(){
    
    // 用户中心access_token
    if (!this.globalData.access_token) {
      xy.userLogin((data) => {
        this.globalData.access_token = data.token;
        this.globalData.subscribe = data.subscribe;
        this.userCenterLoginCallbackOnClickVipLock  && this.userCenterLoginCallbackOnClickVipLock();
        this.globalData.userInfo = {
          nickname: data.nickname,
          avatar: data.avatar,
        };
        this.globalData.introduceUrl = data.introduceUrl || "";
        wx.setStorageSync("USER_INFO", data);
        this.userCenterLoginCallbackIndex&&this.userCenterLoginCallbackIndex();

      });
    } 
    // 初始化语言列表
    this.getLangConfig();


    // 图片提取文字 token
    if (!this.globalData.x_access_token) {
      this.getAccessToken((token) => (this.globalData.x_access_token = token));
    }

    // 获取当前网络状态
    xy.getNetworkStatus((e) => (this.globalData.currentNetwork = e)); 
  }, 
  setNavBarInfo() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    // console.warn(systemInfo);
    // console.warn(menuButtonInfo);
    this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight)  + menuButtonInfo.height+menuButtonInfo.top/2;
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    this.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuHeight = menuButtonInfo.right;
    this.globalData.screenHeight = systemInfo.screenHeight-systemInfo.statusBarHeight;
 },
  userCenterLogin(){
    xy.userLogin((data) => {
      this.globalData.access_token = data.token;
      this.globalData.subscribe = data.subscribe;
      this.userCenterLoginCallbackOnClickVipLock  && this.userCenterLoginCallbackOnClickVipLock();

      this.globalData.userInfo = {
        nickname: data.nickname,
        avatar: data.avatar,
      };
      this.globalData.introduceUrl = data.introduceUrl || "";
      wx.setStorageSync("USER_INFO", data);
      this.userCenterLoginCallbackIndex();
      this.userCenterLoginCallbackUserMember();
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
          console.log("上传成功", res);
          let resData = JSON.parse(res.data);
          resolve(resData);
        },
        fail: function (err) {
          wx.hideLoading();
          console.log("上传失败", err);
          reject(err);
        },
      });
    });
  },
  // 获取文字提取token
  getAccessToken(cb) {
    wx.request({
      url: this.globalData.apiUrl + "/oauth/2.0/token",
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
  // 识别图片提取文字 （外部接口）
  async extractText(url) {
    console.log(url);
    let base64Image = await xy.imageToBase64(url);
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.apiUrl +
          "/rest/2.0/ocr/v1/general_basic?access_token=" +
          this.globalData.x_access_token,
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: {
          image: base64Image,
          detect_direction: "true",
          detect_language: "true",
        },
        success: (res) => {
          console.log("识别成功", res);
          resolve(res.data);
        },
        fail: (err) => reject(err),
      });
    });
  },
  // 提取图片文字 (自己的接口)
  extractText2(url) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.uploadFile({ filePath: url, type: 'images' }).then((res) => {
        if (res.code == 1) {
          // {{host}}/api/ocr/cloud
          //           请求参数
          // Body 请求参数
          // 复制
          // {
          // "url": "http://static-1253713495.cos.ap-chengdu.myqcloud.com/paper_images/655c4fd33ea5a/1.jpg" 
          // }
          that.request(that.globalData.globalHost + "/api/ocr/cloud", { url: res.data.url },
            "POST"
          ).then((res) => {
            if (res.code == 1) {
              resolve(res);
            } else {
              reject(res);
            }
          }).catch((err) => {
            reject(err);
          });
        } else {
          reject(res);
        }
      });
    });
  },

  // 更新用户信息
  updateUserInfo(userInfo) {
    let that = this;
    return new Promise((resolve, reject) => {
      that
        .request(
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
            console.log("请求失败", res.data.msg);
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
  dowloadWord(text){
    //
    const req= this.request("/tools/text-to-word",{
      text:text
    },"POST");
    req.then(function(data){
      console.warn("dowloadWord:",data)
      wx.downloadFile({
        url:data.url,
        timeout:6000,
        url:data.url, 
        success (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) { 
              wx.showToast({
                title: "下载成功",
                icon: "none",
                duration: 2000,
              });
          }
        }
      });
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
})
