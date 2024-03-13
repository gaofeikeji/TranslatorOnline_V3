// pages/indexpicture/index.js
const app = getApp();
Page({ 
  /**                  
   * 页面的初始数据
   */
  data: { 
    scale:false,
    selectPicturPath:app.globalData.selectPicturPath,
    action:false,
    actype:10,//10逐行对比左右布局,11，逐行对比垂直布局; 20复制内容，30导出文件，40显示结果，41隐藏
    //底部功能区域
    list: [
      {
        "iconPath": "/images/nav/duibi.png",
        "selectedIconPath": "/images/nav/duibi.png",
        "text": "逐行对比",
        "actype": 10,
        "type":0
      },
      {
        "iconPath": "/images/copy.png",
        "selectedIconPath": "/images/nav/copy.png",
        "text": "复制内容",
        "actype": 20,
        "type":0
      },
      {
        "iconPath": "/images/nav/export.png",
        "selectedIconPath": "/images/nav/duibi.png",
        "text": "导出结果",  
        "actype": 30,
        "type":0
      },
      {
        "iconPath": "/images/nav/result.png",
        "selectedIconPath": "/images/nav/result.png",
        "text": "显示结果",  
        "selectedText":"隐藏结果",
        "actype": 40,
        "type":0
      },                                                                                       
    ],  
    // langList
    langList:[
      {
      "single_pos": {
        "pos": [{
          "x": 52.9187775,
          "y": 18.7191887
        }]
      },
      "single_str_utf8": "LUENCE",
      "single_rate": 0.9405303,
      "left": 52.647438,
      "top": 18.7191887,
      "right": 121.645035,
      "bottom": 40.2459221,
      "translate": "LUENCE"
    }, {
      "single_pos": {
        "pos": [{
          "x": 17.7503242,
          "y": 46.2131119
        }]
      },
      "single_str_utf8": "《影响力》《经典版)",
      "single_rate": 0.967180848,
      "left": 17.4524727,
      "top": 46.2131119,
      "right": 136.029221,
      "bottom": 63.7645874,
      "translate": "The Influence, The Classic Edition)"
    }, {
      "single_pos": {
        "pos": [{
          "x": 5.57366896,
          "y": 62.8129349
        }]
      },
      "single_str_utf8": "震撼呈现",
      "single_rate": 0.982250273,
      "left": 5.3050518,
      "top": 62.8129349,
      "right": 70.8121185,
      "bottom": 79.3515549,
      "translate": "Shock presentation"
    }, {
      "single_pos": {
        "pos": [{
          "x": 78.695816,
          "y": 64.1407852
        }]
      },
      "single_str_utf8": "不容错过",
      "single_rate": 0.998655558,
      "left": 78.4201355,
      "top": 64.1407852,
      "right": 146.416428,
      "bottom": 81.5539856,
      "translate": "unmissable"
    }, {
      "single_pos": {
        "pos": [{
          "x": 2.58125234,
          "y": 102.72979
        }]
      },
      "single_str_utf8": "量震摄人心，最诡遇的心理学畅销书",
      "single_rate": 0.805575609,
      "left": 2.36199498,
      "top": 102.72979,
      "right": 166.960892,
      "bottom": 116.629555,
      "translate": "The most difficult psychology bestseller"
    }, {
      "single_pos": {
        "pos": [{
          "x": 10.0131683,
          "y": 117.390343
        }]
      },
      "single_str_utf8": "作为京湖西国心理路会，美国心理学基金会车度大共提店台",
      "single_rate": 0.612110674,
      "left": 9.82096672,
      "top": 117.390343,
      "right": 180.348969,
      "bottom": 129.319595,
      "translate": "As the Beijing Lake West Country Psychological Road Association, the American Psychology Foundation"
    }, {
      "single_pos": {
        "pos": [{
          "x": 1.78620601,
          "y": 128.124573
        }]
      },
      "single_str_utf8": "大生上量连大，最震损人心 最德活的心理学畅辆书，24年年",
      "single_rate": 0.609538138,
      "left": 1.5904783,
      "top": 128.124573,
      "right": 180.069427,
      "bottom": 140.41095,
      "translate": "Big life on the number of large, the most shock of the most moral psychology free book, 24 years"
    }, {
      "single_pos": {
        "pos": [{
          "x": 5.04029369,
          "y": 139.133331
        }]
      },
      "single_str_utf8": "全球购量国过20万平，时至今日，本书仍位圳营马走总排行性",
      "single_rate": 0.59955126,
      "left": 4.85776091,
      "top": 139.133331,
      "right": 182.305817,
      "bottom": 150.996811,
      "translate": "The global purchase volume of countries over 200,000, up to now, the book is still the total ranking of the horse"
    }, {
      "single_pos": {
        "pos": [{
          "x": 3.07359028,
          "y": 149.385056
        }]
      },
      "single_str_utf8": "学和应用心理学类畅销书桥首，也正是在这个畅销顺本的善时上",
      "single_rate": 0.672715,
      "left": 2.8512156,
      "top": 149.385056,
      "right": 184.565765,
      "bottom": 162.270279,
      "translate": "Learning and applied psychology is also in this popular good time"
    }, {
      "single_pos": {
        "pos": [{
          "x": 2.04925799,
          "y": 160.274979
        }]
      },
      "single_str_utf8": "坦福大于界事所名校所深用的教财店本",
      "single_rate": 0.607658505,
      "left": 1.80609274,
      "top": 160.274979,
      "right": 114.664169,
      "bottom": 171.130768,
      "translate": "Tamford is more important than a famous school"
    }, {
      "single_pos": {
        "pos": [{
          "x": 1.34095776,
          "y": 179.803391
        }]
      },
      "single_str_utf8": "典量现",
      "single_rate": 0.705112457,
      "left": 1.08881927,
      "top": 179.803391,
      "right": 32.3804359,
      "bottom": 190.316879,
      "translate": "The quantity is now"
    }, {
      "single_pos": {
        "pos": [{
          "x": 16.1755791,
          "y": 194.787186
        }]
      },
      "single_str_utf8": "得源导涨 这是一本最原斗原味的《影确力》 即原甘园",
      "single_rate": 0.532054245,
      "left": 15.9466982,
      "top": 194.787186,
      "right": 183.330353,
      "bottom": 207.464478,
      "translate": "The source guide rise this is a most original \"shadow force\" is the original Gan garden"
    }, {
      "single_pos": {
        "pos": [{
          "x": 2.61307025,
          "y": 203.976486
        }]
      },
      "single_str_utf8": "服车尚南南卫在对生，让你可以信图给啊，",
      "single_rate": 0.321965545,
      "left": 2.27357697,
      "top": 203.976486,
      "right": 127.32122,
      "bottom": 216.99086,
      "translate": "Serve the car is still in the life, so that you can believe the picture to ah,"
    }, {
      "single_pos": {
        "pos": [{
          "x": 126.189583,
          "y": 210.481247
        }]
      },
      "single_str_utf8": "在正将防停商中低",
      "single_rate": 0.519436359,
      "left": 126.189583,
      "top": 210.481247,
      "right": 183.210419,
      "bottom": 216.927078,
      "translate": "In the future anti-stop business low"
    }]
  }, 
  // 页面切换
  selectFunction(e) {
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn(index,  actype, this.data.actype ); 
    this.showActionBox(actype);
}, 
showActionBox(actype){  
  let show = this.data.action?false:true;
  if(actype===0){
    console.log("actype====0");  
    show=false;
  }
  if(actype==10){
    console.log("actype===10");
    show=true;
    this.getPictureInfo(this.data.selectPicturPath)
  }else if(actype==11){
    console.log("actype===11");
    show=true;
  }else if(actype==20){
    console.log("actype====2");
  }else if(actype==30){
    console.log("actype====3");
  }
  console.warn("actypeactype:",  actype );   
  this.setData({
    actype: actype,
    action:show,
    scale:show?true:false
    })
},
getPictureInfo(picUrl){
//  picUrl="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg";
  const tThis=this;
  let pictureInfo = app.request("/api/translate/photo", { 
    "source": "auto", //来源语音
      "target": "en", //目标语言
      "url": picUrl  
    }, "POST"); 
    pictureInfo.then((res)=>{
        console.warn("getPictureInfo",res.data)
        tThis.setData({
          langList: res.data 
          })
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      nbTitle: '图片翻译',
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