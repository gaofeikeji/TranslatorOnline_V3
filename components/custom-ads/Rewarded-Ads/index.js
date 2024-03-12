import { request } from '../http.js'

// var videoAd = null
const date = new Date()
const SHOW_AD_KEY = 'LAST_AD_SHOW_DATE'
const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

const jili_ad = 'JILIAD'

// 小程序激励广告
let adVideoUtils = {
  /**
   * @param {String} adUnitId 小程序广告视频id
   * @param {Function} callback 激励广告完成后的事件回调
   * videoAdLoad 加载广告
  */
  videoAd: null,
  async videoAdLoad(adUnitId = 'videoAd', callback) {
    // 请求数据，获取激励视频广告ID 特殊情况
    if (!wx.getStorageSync(jili_ad)) {
      const ret = await request('4', '')
      if (ret.code == 0) {
        // 存储到缓存中
        wx.setStorageSync(jili_ad, ret)
        // 初始化激励广告
        adVideoUtils.initAd(ret, callback)
      }
    } else {
      // 缓存中有数据直接读取
      const data = wx.getStorageSync(jili_ad)
      adVideoUtils.initAd(data, callback)
    }
  },
  initAd(data, callback) {
    if (this.videoAd) {
      this.videoAd = null
    }

    if (data.show == 1 && wx.createRewardedVideoAd) {
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: data.adUnitId,
      })
      this.videoAd.onLoad(() => {})
      this.videoAd.onError((err) => { 
        // 激励广告拉取失败 下发奖励
        // callback()  // 不能在这里执行，应该在关闭的时候执行
      })
      this.videoAd.onClose((status) => {
        if (status && status.isEnded || status === undefined) {
          adVideoUtils.setShowAd()
          // 视频广告播放完毕，正常执行回调函数任务
          callback() 
        } else {
          // 视频播放中途退出，进行提示
          wx.showToast({ title: '广告观看完才可继续操作!', icon: 'none' })
        }
      })
    }
  },
  showAd() {
    if (this.videoAd) {
      this.videoAd.show().catch(() => {
        // 失败重试
        this.videoAd.load()
          .then(() => this.videoAd.show())
          .catch(err => {
            console.log('激励视频显示广告失败')
          })
      })
    }
  },
  setShowAd() {
    wx.setStorageSync(SHOW_AD_KEY, dateStr)
  },
  checkIsShowAd() {
    return wx.getStorageSync(SHOW_AD_KEY) === dateStr && this.videoAd
  },
  showModel(ctx, callback) {
    if (!adVideoUtils.checkIsShowAd() && this.videoAd) {
      wx.showModal({
        title: '提示',
        content: ctx,
        success(res) {
          if (res.confirm) {
            adVideoUtils.showAd()
          } else {
            console.log('用户点击了取消.')
          }
        },
      })
    } else {
      callback()
    }
  }
}

export { adVideoUtils }