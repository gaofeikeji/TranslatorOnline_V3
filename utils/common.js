// 全局参数
const baseUrls = {
  develop: "https://usercenter.mp.lighthg.com", // 开发环境
  release: "https://usercenter.mp.lighthg.com", // 正式环境
  trial: "https://usercenter.mp.lighthg.com", // 体验环境
};

/**
 * @description 获取当前环境的hostUrl
 * @returns {String} 返回当前环境下的hostUrl
 */
export const isDevelopmentStatusUrl = () => {
  const env = __wxConfig.envVersion;
  console.log("[***]Version:", __wxConfig.envVersion, baseUrls[env]);
  return baseUrls[env] || baseUrls.develop;
};

// 用户登录
export const userLogin = (callback) => {
  wx.login({
    success: (res) => {
      if (res.code) {
        wx.request({
          url: `${isDevelopmentStatusUrl()}/api/user/login`,
          method: "POST",
          data: {
            code: res.code,
          },
          success: (res) => {
            console.log("userLogin:",res.data);
            if (res.data.code == 1) {
              wx.setStorageSync("access_token", res.data.data.token);
              typeof callback === "function" && callback(res.data.data);
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: "none",
                duration: 2000,
              });
            }
          },
        });
      }
    },
  });
};

// 更新用户信息
export const updateUserInfo = (userInfo) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${isDevelopmentStatusUrl()}/api/user/update`,
      method: "POST",
      header: {
        Authorization: wx.getStorageSync("access_token"),
      },
      data: {
        nickname: userInfo.nickname,
        avatar_url: userInfo.avatar_url,
      },
      success: (res) => {
        resolve(res.data);
      },
      reject: (err) => {
        reject(err);
      },
    });
  });
};

// 上传文件
export const uploadFile = (data) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${isDevelopmentStatusUrl()}/api/upload/store`,
      filePath: data.filePath,
      name: "file",
      header: {
        Authorization: wx.getStorageSync("access_token"),
      },
      formData: {
        type: data.type,
      },
      success: function (res) {
        console.log("uploadFile：resp");
        console.log(res);
        let resData = JSON.parse(res.data);
        resolve(resData);
      },
      fail: function (err) {
        console.error("uploadFile：resp-err");
        reject(err);
      },
    });
  });
};

// 图片上传需要的参数
export const uploadData = (tempUrl) => {
  return { filePath: tempUrl, type: "images" };
};

// // 图片安全检测请求
// export const verifyImage = (url) => {
//   let that = this;
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: `${isDevelopmentStatusUrl()}/api/mini_api/image_check`,
//       method: "POST",
//       header: {
//         Authorization: wx.getStorageSync("access_token"),
//       },
//       data: {
//         url: url,
//       },
//       success: (res) => {
//         resolve(res.data);
//       },
//       reject: (err) => reject(err),
//     });
//   });
// };
// };

// 图片安全检测请求
export const verifyImage = (url) => {
  let that = this;
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${isDevelopmentStatusUrl()}/api/mini_api_v2/media_check_multi`,
      method: "POST",
      header: {
        Authorization: wx.getStorageSync("access_token"),
      },
      data: {
        url: url,
        "type": 2 
      },
      success: (res) => {
        resolve(res.data);
      },
      reject: (err) => reject(err),
    });
  });
};

/**
 * @description 文字安全检测
 * @param {String} content 文字内容
 * @param {Function} successFunc 成功回调函数
 * @param {Function} failFunc 失败回调函数
 */
export const checkTextSync = ({ content, successFunc, failFunc }) => {
  wx.request({
    url: `${isDevelopmentStatusUrl()}/api/mini_api/text_check`,
    method: "POST",
    header: {
      Authorization: wx.getStorageSync("access_token"),
    },
    data: {
      content: content,
    },
    success: (res) => {
      if (res.data.code == 1) {
        typeof successFunc === "function" && successFunc(res.data);
      } else {
        typeof failFunc === "function" && failFunc(res.data);
      }
    },
    fail: (err) => {
      wx.showToast({ title: err.errMsg, icon: "none", duration: 2000 });
    },
  });
};

/**
 * @description 单张图片安全检测 同步
 * @param {String} tempUrl 临时图片路径
 * @param {Object} instance 当前页面this
 * @param {Function} success 成功回调函数
 * @param {Function} fail 失败回调函数
 */
export const checkImageSync = async ({
  tempFilePaths: tempUrl,
  instance,
  success,
  fail,
  message = "请稍候",
}) => {
  try {
    // 信息提示
    wx.showLoading({ title: message, mask: true });
    // 图片安全检测之前需要先压缩图片，主要是为了处理图片大于1M的情况
    // const compressRes = await compressImage(tempUrl, instance);

    // // 拼接上传参数
  const data = uploadData(tempUrl);
    const res = await uploadFile(data);
    if (res.code != 1) {
      wx.showToast({ title: res.msg, icon: "none", duration: 2000 });
      return false;
    }
    console.log("uploadFileuploadFileuploadFile：resp");
    console.log(res);

    // 图片安全检测
    const verifyRes = await verifyImage(res.data.url);
    console.log("uploadFile:------", res);
    console.log("verifyRes:-------", verifyRes);
    if (verifyRes.code == 1) {
      // 图片安全检测成功
      typeof success === "function" && success(res.data);
    } else {
      typeof fail === "function" && fail(verifyRes);
    }
  } catch (error) {
    console.log("bbb");
    // 图片安全检测失败
    typeof fail === "function" && fail(error);
  } finally {
    wx.hideLoading();
  }
};

/**
 * @description Canvas压缩图片用于图片同步安全检测
 * @param {String} src 图片路径
 * @param {Object} _this 当前页面this
 * @returns {Promise} 返回压缩后的图片路径
 */
export const compressImage = (src, _this) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: src,
      success: function (res) {
        let ratio = 2;
        let canvasWidth = res.width;
        let canvasHeight = res.height;
        while (canvasWidth > 750 || canvasHeight > 1200) {
          // 保证宽在750，高1200
          canvasWidth = Math.trunc(res.width / ratio);
          canvasHeight = Math.trunc(res.height / ratio);
          ratio++;
        }
        _this.cWidth = canvasWidth;
        _this.cHeight = canvasHeight;
        _this.setData({
          ccWidth: canvasWidth,
          ccHeight: canvasHeight,
        });
        let ctx = wx.createCanvasContext("mCanvas");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight);
        ctx.draw(
          false,
          (_this.timer = setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: "mCanvas",
              destWidth: canvasWidth / 2, // 输出的图片的宽度
              destHeight: canvasHeight / 2, // 输出的图片的高度
              fileType: "png", // 图片输出格式
              quality: 0.8, // 图片质量 0-1
              success: function (res) {
                clearTimeout(_this.timer);
                resolve(res.tempFilePath);
              },
              fail: function (err) {
                clearTimeout(_this.timer);
                reject(err);
              },
            });
          }, 300))
        ); //留一定的时间绘制canvas
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
};

// 压缩图片需要定义html中的canvas标签
// <canvas canvasId="mCanvas" style="position: absolute; left: -9999px; top: -9999px; width:{{ccWidth}}px;height:{{ccHeight}}px;"></canvas>

/**
 * @description: 获取当前网络状态
 * @param {Promise} 返回网络状态
 */
export const getNetworkStatus = (cb) => {
  wx.getNetworkType({
    success(res) {
      if (res.networkType != "none") {
        typeof cb == "function" && cb(res.networkType);
      }
    },
  });
};

/**
 * @description: 通用showModal信息提示框
 * @param {String} message 提示信息
 */
export const showTip = (message) => {
  wx.showModal({
    title: "提示",
    content: message || "稍后再试",
    showCancel: false,
    confirmText: "我知道了",
  });
};

/**
 * @description: 保存图片到相册 判断是否授权 没有授权则打开授权页面
 * @param {Function} successFunc 成功回调函数
 * @param {Function} failFunc 失败回调函数
 * @param {Function} completeFunc 完成回调函数
 */
export const saveAlbumAuth = ({ successFunc, failFunc, completeFunc }) => {
  wx.getSetting({
    success: (res) => {
      if (!res.authSetting["scope.writePhotosAlbum"]) {
        wx.authorize({
          scope: "scope.writePhotosAlbum",
          success: () => {
            typeof successFunc === "function" && successFunc();
          },
          fail: () => {
            // 用户拒绝授权后弹出提示框 提示用户去设置页面打开授权
            wx.showModal({
              title: "提示",
              content: "检测到您没打开相册权限，是否去设置打开？",
              confirmText: "确认",
              cancelText: "取消",
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.writePhotosAlbum"]) {
                        typeof successFunc === "function" && successFunc();
                      } else {
                        typeof failFunc === "function" && failFunc();
                      }
                    },
                  });
                } else {
                  typeof failFunc === "function" && failFunc();
                }
              },
            });
          },
          complete: () => {
            typeof completeFunc === "function" && completeFunc();
          },
        });
      } else {
        typeof successFunc === "function" && successFunc();
      }
    },
  });
};

/**
 * @description: 保存base64图片到本地
 * @param {String} url base64图片
 */
export const saveBase64Image = (url) => {
  // 如果图片数据中含有 data:image/png;base64, 时，先要处理一下 url.slice(22) 意思是把  data:image/png;base64,  这一段去除
  let fs = wx.getFileSystemManager();
  let num = Date.now();
  wx.showLoading({ title: "保存中...", mask: true });
  fs.writeFile({
    filePath: wx.env.USER_DATA_PATH + "/pic" + num + ".png",
    data: url,
    encoding: "base64",
    success: (res) => {
      wx.saveImageToPhotosAlbum({
        filePath: wx.env.USER_DATA_PATH + "/pic" + num + ".png",
        success: (e) => {
          wx.showToast({ title: "保存成功", icon: "success", duration: 2000 });
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    fail: (err) => console.log(err),
  });
};

/**
 * @description: 批量保存base64图片到本地相册
 * @param {Array} urls base64图片数组
 * @param {Function} successFunc 成功回调函数
 * @param {Function} failFunc 失败回调函数
 */
export const saveBase64Images = ({ urls, successFunc, failFunc }) => {
  wx.showLoading({ title: "保存中...", mask: true });
  let fs = wx.getFileSystemManager();
  let num = Date.now();
  let successNum = 0;
  let failNum = 0;
  urls.forEach((url, index) => {
    fs.writeFile({
      filePath: wx.env.USER_DATA_PATH + "/pic" + num + index + ".png",
      data: url,
      encoding: "base64",
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + "/pic" + num + index + ".png",
          success: (e) => {
            successNum++; // 保存成功数量
            if (successNum == urls.length) {
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 2000,
              });
              typeof successFunc === "function" && successFunc();
            }
          },
          fail: (err) => {
            failNum++; // 保存失败数量
            if (failNum == urls.length) {
              typeof failFunc === "function" && failFunc();
            }
          },
        });
      },
      fail: (err) => {
        failNum++;
        if (failNum == urls.length) {
          typeof failFunc === "function" && failFunc();
        }
      },
    });
  });
};

/**
 * @description: 保存网络图片到本地
 * @param {String} url 图片url
 * @param {Function} successFunc 成功回调函数
 * @param {Function} failFunc 失败回调函数
 */
export const saveNetImage = ({ url, successFunc, failFunc }) => {
  wx.showLoading({ title: "保存中...", mask: true });
  wx.downloadFile({
    url: url,
    success: (res) => {
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (e) => {
          wx.showToast({ title: "保存成功", icon: "success", duration: 2000 });
          typeof successFunc === "function" && successFunc();
        },
        fail: (err) => {
          typeof failFunc === "function" && failFunc();
        },
      });
    },
    fail: (err) => {
      typeof failFunc === "function" && failFunc();
    },
  });
};

/**
 * @description: 批量保存网络图片到本地相册
 * @param {Array} urls 图片url数组
 * @param {Function} successFunc 成功回调函数
 * @param {Function} failFunc 失败回调函数
 */
export const saveNetImages = ({ urls, successFunc, failFunc }) => {
  // 带有进度的信息提示
  let successNum = 0;
  let failNum = 0;
  urls.forEach((url, index) => {
    // 信息提示
    wx.showLoading({
      title: `保存中 ${successNum}/${urls.length}`,
      mask: true,
    });
    wx.downloadFile({
      url: url,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (e) => {
            successNum++; // 保存成功数量
            if (successNum == urls.length) {
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 2000,
              });
              typeof successFunc === "function" && successFunc();
            }
          },
          fail: (err) => {
            failNum++; // 保存失败数量
            if (failNum == urls.length) {
              typeof failFunc === "function" && failFunc();
            }
          },
        });
      },
      fail: (err) => {
        failNum++;
        if (failNum == urls.length) {
          typeof failFunc === "function" && failFunc();
        }
      },
    });
  });
};

/**
 * @description: 保存临时图片到本地
 * @param {String} tempUrl 临时图片路径
 * @param {Function} successFunc 成功回调函数
 * @param {Function} failFunc 失败回调函数
 */
export const saveTempImage = ({ tempUrl, successFunc, failFunc }) => {
  wx.showLoading({ title: "保存中...", mask: true });
  wx.saveImageToPhotosAlbum({
    filePath: tempUrl,
    success: (e) => {
      wx.showToast({ title: "保存成功", icon: "success", duration: 2000 });
      typeof successFunc === "function" && successFunc();
    },
    fail: (err) => {
      typeof failFunc === "function" && failFunc();
    },
  });
};

/**
 * @description: 批量保存临时图片到本地相册
 * @param {Array} tempUrls 临时图片路径数组
 * @param {Function} successFunc 成功回调函数
 * @param {Function} failFunc 失败回调函数
 */
export const saveTempImages = ({ tempUrls, successFunc, failFunc }) => {
  let successNum = 0;
  let failNum = 0;
  tempUrls.forEach((tempUrl, index) => {
    // 信息提示
    wx.showLoading({
      title: `保存中 ${successNum}/${tempUrls.length}`,
      mask: true,
    });
    wx.saveImageToPhotosAlbum({
      filePath: tempUrl,
      success: (e) => {
        successNum++; // 保存成功数量
        if (successNum == tempUrls.length) {
          wx.showToast({ title: "保存成功", icon: "success", duration: 2000 });
          typeof successFunc === "function" && successFunc();
        }
      },
      fail: (err) => {
        failNum++; // 保存失败数量
        if (failNum == tempUrls.length) {
          typeof failFunc === "function" && failFunc();
        }
      },
    });
  });
};

/**
 * @description: 图片转base64
 * @param {String} url 图片url
 * @returns {Promise} 返回base64图片
 */
export const imageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      responseType: "arraybuffer",
      success: (res) => {
        let base64 = wx.arrayBufferToBase64(res.data);
        resolve(base64);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

/**
 * 
 * @param {String} str  需要配置到剪切板的内容
 */
export const setClipboardData = (str) => {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data: str,
      success: () => {
        wx.hideLoading();
        console.log('设置剪贴板内容成功');
      }
    });
  });
};

/**
 * 
 * @param {String} str  需要配置到剪切板的内容
 */
export const getClipboardData = () => {
  return new Promise((resolve, reject) => { 
    wx.getClipboardData({
      success (res){ 
        console.warn("剪切板获取",res) 
        resolve(res);
      },
      fail(res){ 
        reject("")
      },
    })

  });
};
  