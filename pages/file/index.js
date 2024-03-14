// pages/file/index.js
var app = getApp();
import * as xy from "../../utils/common.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff', 
    initCamral:false,
    ccWidth:0, 
    ccHeight:0,
    selectPicturPath:"/images/bg/bg-dark.png"
  },
//   选择照片
  takePhoto(){
      let tThis= this;
      wx.chooseMedia({
          count: 1,
          mediaType: ["image"],
          sourceType: ["album", "camera"],
          maxDuration: 30,
          camera: 'back',
          success(res) {
            const uploadPath = res.tempFiles[0]['tempFilePath']
            tThis.setData({ 
                selectPicturPath:uploadPath
            })
            console.log(res)
            console.log(res.tempFiles[0].size)
            // return  false;
            wx.showLoading({ title: "翻译中...", mask: true });
            xy.checkImageSync({
              tempFilePaths: uploadPath,
              instance: tThis,
              success: (imgRes) => {  
                 wx.hideLoading();
                console.warn("imgRes::",imgRes)
                  tThis.setData({
                    selectPicturPath: imgRes.url,
                    initCamral:false
                  });
                  app.globalData.selectPicturPath=imgRes.url;
                  wx.navigateTo({
                    url: "/pages/indexpicture/index"
                  })
              },
              fail: (err) => {
                wx.hideLoading();
                xy.showTip(err.msg);
              },
            });
          },
          fail(res) {
            console.warn("cancel_fail::",res)
            // wx.navigateTo({
            //   url: "/pages/indexpicture/index"
            // })
          },
          complete(res) {
            console.error(res)
          },
        })
  },  
  // 查看原图
  viewImage() {
    wx.showActionSheet({
      itemList: ["重新上传", "查看大图"],
      success: (e) => {
        this.takePhoto();
        // if (e.tapIndex == 0) {
        //   this.takePhoto();
        // } else if (e.tapIndex == 1) {
        //   wx.previewImage({
        //     urls: [this.data.image_url],
        //     current: this.data.image_url,
        //   });
        // }
      },
      fail: (err) => {
        wx.showToast({ title: err, icon: "none" });
      },
    });
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
  // 返回
  back() {
    console.warn(" wx.navigateBack");
    wx.navigateBack({
      delta: 1,
    }); 
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