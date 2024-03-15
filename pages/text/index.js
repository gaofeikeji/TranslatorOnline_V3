// pages/text/index.js
import * as xy from "../../utils/common.js";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fromText:"亲爱的爸爸妈妈： 你们好！ 谢谢你们把我带到这个美丽的世界，是你们把我从小养大，教我做人的道理。妈妈你每天为我穿衣做饭，爸爸你教我完成家庭作业，还要努力的工作。为了家人的幸福，为了我的健康成长付出了很多，你们辛苦了！\n\n 记得有一次，我8岁那年的一天夜里，我突然发高烧，你们忘记了一天的疲劳，着急的把我送到医院，医生给我打了吊针，你们整整陪了我一夜。第二天早上我醒来，你们用熬红了的眼睛看着我，问我好点了吗，我感动的说不出话来，眼泪直往脸上流。\n 还记得有一次，我考试没考好，回到家，非常伤心，妈妈你仿佛看出了我的心思，亲切地对我说：“这次没考好，下次再努力，别灰心。”爸爸你走过来，细心地给我分析、教导，使我鼓起了勇气，学习成绩得到了很大的提高。 爸爸妈妈，你们为我付出了那么多的心血，我一定会报答您们，我会好好学习，绝不辜负你们对我的期望！",//输入框内容
  },

  // 粘贴和清空 
  textFun(e) {
    const tThis=this;
    const { index, actype } = e.currentTarget.dataset;
    console.warn(e);  
    console.warn("textFun", actype); 
    if(actype=="0"){//清空剪贴板
      xy.setClipboardData("");
    }else if(actype=="1"){//粘贴内容
      const resp = xy.getClipboardData();
      resp.then(function(rep){ 
        tThis.setData({           
          fromText:rep.data
        })
      });
    }else if(actype=="2"){//确认翻译
      const resp = tThis.data.fromText;
      console.warn("fromText::",resp);
      if(resp!=""&&resp.length<1000){ 
        wx.navigateTo({
          url: "/pages/texttranslate/index?text="+resp
        })
      }
    }
    // this.setData({
    //   currentSelectY: top, 
    //   scale:1
    //   })
}, 
// 监听输入框改变
updateFormText(e){
  this.setData({
    fromText: e.detail.value,
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(){
    this.setData({
      nbTitle: '文本翻译',
      nbLoading: false, 
    })
    // xy.setClipboardData("少小离家老大回人之初性本善");
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