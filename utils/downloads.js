/**
 *  获取相册权限
 */
export function wxSaveAuth() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 如果没有写入权限，则获取写入相册权限
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              resolve()
            },
            fail(err) {
              reject(err)
              // 用户拒绝授权
              wx.showModal({
                content: '检测到您没打开相册权限，是否去设置打开？',
                confirmText: '确认',
                cancelText: '取消',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: res => {}
                    })
                  }
                }
              })
            }
          })
        } else {
          resolve()
        }
      },
      fail(e) {
        reject(e)
      }
    })
  })
}

/**
 * base64图片保存到相册
 * @param {String} url base64
 */
export function downloadBase64Image(url) {
  // 如果图片数据中含有 data:image/png;base64, 时，先要处理一下 url.slice(22) 意思是把  data:image/png;base64,  这一段去除
  let save = wx.getFileSystemManager()
  let number = Date.now()
  save.writeFile({
    filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
    data: url,
    encoding: 'base64',
    success: res => {
      wx.saveImageToPhotosAlbum({
        filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
        success: e => {
          wx.showToast({
            title: '保存成功',
          })
        },
        fail: err => {
          console.log(err)
        }
      })
    },
    fail: err => console.log(err)
  })
}

export function saveBase64ImageToAlbum(base64Data) {
  return new Promise((resolve, reject) => {
    let save = wx.getFileSystemManager()
    let number = Date.now()
    save.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
      data: base64Data,
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
          success: e => {
            resolve(e)
          },
          fail: err => {
            reject(err)
          }
        })
      },
      fail: err => console.log(err)
    })
  })
}

/**
 * base64图片批量保存到相册
 * @param {Array} images base64
 */
export async function downloadBase64Images(images) {
  wx.showLoading({
    title: '图片保存中',
    mask: true
  })
  // 循环数组
  for (let i = 0; i < images.length; i++) {
    try {
      const base64Data = images[i] // 这里应该是一个base64字符串
      await saveBase64ImageToAlbum(base64Data)
      console.log(`第 ${i + 1} 张图片保存成功`)
      if (i == images.length - 1) {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
        })
      }
    } catch (error) {
      console.error(`第 ${i + 1} 张图片保存失败`, error)
      wx.hideLoading()
    }
  }
}

/**
 * 多文件下载并且保存 
 * @param {Array} urls 网络图片数组
 */
export function downloadImgs(urls) {
  console.log(urls)
  wx.showLoading({
    title: '图片下载中',
    mask: true
  })
  const imageList = []
  // 循环数组
  for (let i = 0; i < urls.length; i++) {
    imageList.push(getTempPath(urls[i]))
  }
  const loadTask = []
  let index = 0
  while (index < imageList.length) {
    loadTask.push(
      new Promise((resolve, reject) => {
        // 将数据分割成多个promise数组
        Promise.all(imageList.slice(index, (index += 8)))
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    )
  }
  // Promise.all 所有图片下载完成后弹出
  Promise.all(loadTask)
    .then(res => {
      wx.showToast({
        title: '下载完成',
        duration: 3000
      })
    })
    .catch(err => {
      wx.showToast({
        title: `下载完成`,
        icon: 'none',
        duration: 3000
      })
    })
}
/**
 *
 * @param {String} url 单张网络图片
 */
//下载内容,临时文件路径
function getTempPath(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: url,
      success: function (res) {
        var temp = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: temp,
          success: function (res) {
            return resolve(res)
          },
          fail: function (err) {
            reject(url + JSON.stringify(err))
          }
        })
      },
      fail: function (err) {
        reject(url + JSON.stringify(err))
      }
    })
  })
}