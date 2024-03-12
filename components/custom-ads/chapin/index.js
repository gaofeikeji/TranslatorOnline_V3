import { request } from '../http.js'

let interstitialAd = null
const EVENT_CHAPING_AD = 'EVENT_CHAPING'

let adUtils = {
  chaPingAdLoad: async function() {
    if (!wx.getStorageSync(EVENT_CHAPING_AD)) {
      const ret = await request('1', '')
      if (ret.code == 0) {
        wx.setStorageSync(EVENT_CHAPING_AD, ret)
        this.initChaPingAd(ret)
      }
    } else {
      // 缓存中有数据直接读取
      const data = wx.getStorageSync(EVENT_CHAPING_AD)
      this.initChaPingAd(data)
    }
  },
  initChaPingAd: function(config) {
    console.log(config)
    if (wx.createInterstitialAd && config.show && config.adUnitId) {
      interstitialAd = wx.createInterstitialAd({ adUnitId: config.adUnitId })
      interstitialAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      interstitialAd.onError((err) => {
        console.log('[*] onError v1.0.0')
        console.log('onError event emit', err)
      })
      interstitialAd.onClose((res) => {
        console.log(res)
      })
    }
  },
  showChaPing: function() {
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.log(err)
      })
    }
  },
}

export { adUtils }