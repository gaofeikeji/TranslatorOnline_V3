// pages/file/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff', 
    initCamral:false,
    selectPicturPath:"/images/bg/bg-dark.png"
  },
//   选择照片
  takePhoto(){
      let tThis= this;
      wx.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sourceType: ['album'],
          maxDuration: 30,
          camera: 'back',
          success(res) {
            console.log(res)
            console.log(res.tempFiles.size)
            tThis.setData({
                selectPicturPath:res.tempFiles[0]['tempFilePath']
            })
          },
          fail(res) {
            console.warn(res)
          },
          complete(res) {
            console.error(res)
          },
        })
  }, 
    
    //   选择照片
    takePhotoWithMessage(){
        let tThis= this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            console.log(res)
            console.log(res.tempFiles.size)
            tThis.setData({
                selectPicturPath:res.tempFiles[0]['tempFilePath']
            })
            }
        })
    }, 
  methods:{
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) { 
    this.setData({
        nbTitle: '文件翻译',
        nbLoading: false,
        nbFrontColor: '#ffffff',
        nbBackgroundColor: '#000000',
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})