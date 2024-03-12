/* api url */
export const baseUrl = 'https://ad.lighthg.com'

/* http请求 */
export const request = (ad_type, cid) => {
  const account = wx.getAccountInfoSync()
  const appid = account.miniProgram.appId
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const pageUrl = currentPage.route

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}/config`,
      method: 'POST',
      data: {
        appid,
        customId: cid,  
        path: pageUrl,
        adType: ad_type,
      },
      success (res) {
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
