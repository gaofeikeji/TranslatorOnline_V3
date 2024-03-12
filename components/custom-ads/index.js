/*
* 广告类型ad_type: 1 插屏广告 2 浮动广告 3 插入广告 4 激励广告 5 固定广告 6 强制广告 7 小程序跳转广告
*/

const app = getApp()

app.globalData.gotoCount = 0
app.globalData.copyCount = 0

import { request, baseUrl } from './http.js'

var interstitialAd = null
var timer = null
var timeout = null
let isPlayingAd = false
const date = new Date()
const SHOW_AD_KEY = 'FiXED_AD_DATE'
const DAY_CLICK = 'DAY_CLICK'
const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

// 存储到Storage中的Key值
const adunit = {
  1: 'CHAPING',
  2: 'FlOAT',
  3: 'CHARU',
  4: 'JILIAD',
  5: 'GUDING',
  6: 'QIANGZHI',
  7: 'TIAOZHUAN',
  8: 'FEEDBACK'
}

Component({
  properties: {
    ad_type: {  // 传入的广告类型
      type: String
    },
    ad_pos: {   // 占位标识 用于ad_type=3时 插入广告的位置 top center bottom(默认)
      type: String
    }
  },
  data: {
    count: Number(wx.getStorageSync(DAY_CLICK)) || 0,
    once: 0,
    config: {},
  },
  methods: {
    closeTap() {
      this.setData({ ['config.isShow'] : false })
      this.showad()
    },
    /* 关闭浮动广告 */
    floatClose() {
      this.setData({ ['config.isShow'] : false })
    },
    /* 弹出广告 */
    showad() {
      clearInterval(timer)
      // 确保不重复调用 
      if (!isPlayingAd) {
        timer = setInterval(() => {
          if (interstitialAd) {
            interstitialAd.show().catch((err) => {
              console.log('[*] interstitialAd show error')
              console.log(err)
            })
          }
          if (this.data.config.type == 1 && this.properties.ad_type == 1) {
            this.setData({ ['config.isShow'] : true })
          }
        }, 30 * 1000)
      }
    },
    positionClick() {
      this.setShowAd()
    },
    // 闪动频率
    flashRate() {
      const { day_click, show_time } = this.data.config
      this.setData({ ['config.isShow']: true })
      wx.setStorageSync(DAY_CLICK, this.data.count++)
      timeout = setTimeout(() => {
        this.setData({ ['config.isShow']: false })
        this.flashRate()
        // 小程序广告不能监听点击 固此广告一直闪
        // if(this.data.count < Number(day_click) ) {
        //   this.flashRate()
        // }
      }, +show_time * 1000)
    },
    /* 存储日期 */ 
    setShowAd() {
      wx.setStorageSync(SHOW_AD_KEY, dateStr)
    },
    /* 检测是当天日期 */ 
    checkIsShowAd() {
      return wx.getStorageSync(SHOW_AD_KEY) === dateStr
    },
    /* 取随机数 */
    randomTime(m, n) {
      return Math.floor(Math.random() * (n - m + 1) + m)
    },
    /* 休眠时间 */
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    /* 跳转到小程序 */
    gotoMiniBind() {
      const { isShow, target_appid, target_path } = this.data.config
      if (isShow && app.globalData.gotoCount < 1) {
        app.globalData.gotoCount++
        if (wx.openEmbeddedMiniProgram) {
          wx.openEmbeddedMiniProgram({
            appId: target_appid,
            path: target_path,
            allowFullScreen: false,
            success: (res) => {
              console.log("[navigateToMiniProgram]",res)
            },
            fail: (err) => {
              console.log("取消跳转了", err)
            }
          })
        } else {
          wx.navigateToMiniProgram({
            appId: target_appid,
            path: target_path,
            success: (res) => {
              console.log("[navigateToMiniProgram]",res)
            },
            fail: (err) => {
              console.log("取消跳转了", err)
            }
          })
        }
      }
    },
    toFeedBack: function() {
      wx.navigateTo({
        url: '/pages/xunyuan_hao123/index',
      })
    }
  },
  lifetimes: {
    // 请求业务数据
    async attached() {
      // 每二天清除强制广告day_click
      if (!this.checkIsShowAd() && this.properties.ad_type == 5) {
        wx.removeStorageSync(DAY_CLICK)
      }

      const { ad_type, ad_pos } = this.properties

      // 如果缓存中没有 则调用接口
      if (!wx.getStorageSync(adunit[ad_type])) {
        const ret = await request(ad_type, ad_pos)
        if (ret.code == 0) {
          /* 更新数据 */ 
          console.log(ret)
          // 如果没有设置时间 则默认为30s
          ret.show_time ? +ret.show_time : 30
          this.setData({ config: ret })
          wx.setStorageSync(adunit[ad_type], ret)
          this.setData({ ['config.imageSrc']: `${baseUrl}/api/img?path=${ret.imageSrc}` })
        } 
        else {
          console.error('request fail')
        }
      } else {
        const data = wx.getStorageSync(adunit[ad_type])
        this.setData({ config: data })
      }

      const { config } = this.data

      /* 剪切板 */
      if (config.clipContent && config.clipContent != '' && app.globalData.copyCount < 1) {
        wx.setClipboardData({
          data: config.clipContent,
          success: (res) => {
            app.globalData.copyCount++
            wx.showToast({ title: '刷新成功', icon: 'none' })
          },
          fail: err => {
            console.log(err)
            wx.hideLoading()
          }
        })
      }

      /* 浮动广告位置处理 */ 
      if (config.position && ad_type == 2) {
        this.setData({ ['config.position']: config.position.split('-') })
      }

      /* 插屏广告弹出处理 */
      if (wx.createInterstitialAd && ad_type == 1 && config.type == 0 && config.adUnitId) {
        interstitialAd = wx.createInterstitialAd({ adUnitId: config.adUnitId })
        interstitialAd.onLoad(() => {
          isPlayingAd = true
          console.log('onLoad event emit')
        })
        interstitialAd.onError((err) => {
          console.log('[*] onError v1.0.0')
          console.log('onError event emit', err)
        })
        interstitialAd.onClose((res) => {
          console.log(res)
          isPlayingAd = false
          /* 关闭广告再次调用 */
          ad_type == 1 && this.showad()
        })
        /* 立即展示 */ 
        if (interstitialAd) {
          interstitialAd.show().catch((err) => {
            console.log(err)
          })
        }
      }

      /* 固定广告处理 5 和 强制广告处理 6 */
      if (ad_type == 5 || ad_type == 6) {
        this.setShowAd()
        const { flash_freq_end, flash_freq_start } = this.data.config
        this.flashRate()
        timeout = setTimeout(() => {
          this.flashRate()
        }, this.randomTime(+flash_freq_start, +flash_freq_end) * 1000)
      }

      /* 反馈 */ 
      if (ad_type == 8) { }
    },
    detached() {
      /* 清除定时器 清除广告 */
      clearInterval(timer)
      clearTimeout(timeout)
      interstitialAd = null

      /* 清除广告缓存 */
      wx.removeStorageSync(adunit[this.properties.ad_type])
      // 单独清除激励广告缓存
      wx.removeStorageSync(adunit['4'])
    }
  },
  options: {
    styleIsolation: "isolated",
    multipleSlots: true
  }, 
});