
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showOverture: false,
        keyboardHeight: 0,
        hidden: false,
        content:"",
        pageData: {
            top_title:"热点推荐",
            miniprogram_title:"更多好用的小程序推荐",
            top_list:false,
            miniprogram_list: false,
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      if( options.show && options.show==1 )
      {
          this.setData({
              showOverture: true,
          });
      }
      this.keyBoardHeightChange();
      this.loadData();
    },
    // 监听tabbar点击 如果是从tabbar点击来的则隐藏按钮
    onTabItemTap(item) {
      if (item.pagePath == 'pages/xunyuan_hao123/index') {
        this.setData({ hidden: true })
      }
    },
    loadData: function () {
        const appid = wx.getAccountInfoSync().miniProgram.appId
        wx.request({
            url: 'https://mpss.meitry.com/api/waimai/recommend',
            data: {
                appId: appid
            },
            method: 'GET',
            complete : (res)=> {
                wx.stopPullDownRefresh();
                if( res.data.code && res.data.code!=0 )
                {
                    // wx.showToast({
                    //     title: res.msg,
                    //     icon: 'none',
                    //     duration: 2000
                    // });
                }
                // setTimeout(()=>{
                //     this.setData({ pageData:{top_title:"热点推荐",miniprogram_title:"更多好用的小程序推荐",rengong_title:"人工客服 (9:00-18:00)",miniprogram_list:[{title:"共享记账",desc:"免费的多人记账小程序",icon:"http://wx.qlogo.cn/mmhead/Q3auHgzwzM6Azt2ffiaicQpudsBYPl4eH0xhObO0hlt8bfQP8uQMFhibQ/0",button_text:"立即打卡",appid:"wx7912510ca8133c02",path:"",type:"mini"},{title:"配音小程序",desc:"免费的配音神器PRO",icon:"http://wx.qlogo.cn/mmhead/Q3auHgzwzM6Azt2ffiaicQpudsBYPl4eH0xhObO0hlt8bfQP8uQMFhibQ/0",button_text:"立即打卡",appid:"wx7912510ca8133c02",path:"http://wx.qlogo.cn/mmhead/Q3auHgzwzM6Azt2ffiaicQpudsBYPl4eH0xhObO0hlt8bfQP8uQMFhibQ/0",type:"image"}],top_list:[{ appid:"wx7912510ca8133c02",icon:"https://jizhang-1253713495.file.myqcloud.com/ciba/meituan3.png",path:"",type:"mini"},{appid:"wx7912510ca8133c02",icon:"https://jizhang-1253713495.file.myqcloud.com/ciba/eleme3.png",path:"",type:"mini"}],rengong:{title:"客服-柠檬",desc:"",icon:"https://jizhang-1253713495.file.myqcloud.com/ciba/kefu.png ",button_text:"联系TA",card:"http://wx.qlogo.cn/mmhead/Q3auHgzwzM6Azt2ffiaicQpudsBYPl4eH0xhObO0hlt8bfQP8uQMFhibQ/0"} } });
                // },1000);
            },
            success: (res)=>{
                if( res.data.code==0 )
                {
                    this.setData({ pageData:res.data.data });
                }
            }
        })
    },

    changeOverture: function () {
        this.setData({
            showOverture: !this.data.showOverture
        });
    },

    changeContent:function(e){
        this.setData({
            content: e.detail.value
        });
    },

    submit:function(){
        if(this.data.content!='')
        {
            wx.showLoading({
                title: '提交中...',
            });
            const appid = wx.getAccountInfoSync().miniProgram.appId;
            wx.request({
                url: 'https://mpss.meitry.com/api/mini_program/feedback',
                data: {
                    appid: appid,
                    content:this.data.content
                },
                method: 'POST',
                complete : (res)=> {
                    wx.hideLoading();
                    if( res.data.code!=0 )
                    {
                        wx.showModal({
                            content: res.data.msg,
                            showCancel:false,
                        })
                    }
                },
                success: (res)=>{
                    if( res.data.code==0 )
                    {
                        wx.showModal({
                            content: res.data.msg,
                            showCancel:false,
                        })
                        this.setData({
                            content: '',
                            showOverture:false
                        });
                    }
                }
            });
        }
        else
        {
            wx.showToast({
                title: '请填写反馈内容',
                icon: 'none',
                duration: 2000
            });
        }
    },

    mainTap: function () {

    },

    openMiniprogram: function (e) {
        console.log(e);
        if( e.currentTarget.dataset.type=='image' )
        {
            wx.previewImage({
                current: e.currentTarget.dataset.path,
                urls: [e.currentTarget.dataset.path]
            });
        }
        else
        {
            wx.openEmbeddedMiniProgram({
                appId:e.currentTarget.dataset.appid,
                path:e.currentTarget.dataset.path
            });
        }
    },

    openContact: function (e) {
        console.log(e);
        wx.previewImage({
            current: e.currentTarget.dataset.card,
            urls: [e.currentTarget.dataset.card]
        });
        
    },

    keyBoardHeightChange: function () {
        wx.onKeyboardHeightChange(res => {
            this.setData({
                keyboardHeight: res.height
            });
        })
    },

    textareaFocus: function (e) {
        this.keyBoardHeightChange();
    },
    textareaBlur: function (e) {
        this.keyBoardHeightChange();
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
        this.loadData();
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