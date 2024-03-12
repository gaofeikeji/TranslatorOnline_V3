const app = getApp();
Component({ 
  data: {
      select: 0, 
      list: [
        {
          "iconPath": "/images/picture_translate.png",
          "pagePath": "/pages/index/index",
          "selectedIconPath": "/images/picture_translate.png",
          "text": "传图翻译",
          "type":0
        },
        {
          "iconPath": "/images/text_translate.png",
          "pagePath": "/pages/text/index",
          "selectedIconPath": "images/text_translate.png",
          "text": "文本翻译",
          "type":0
        },
        {
          "iconPath": "/images/file_translate.png",
          "pagePath": "/pages/file/index",
          "selectedIconPath": "/images/file_translate.png",
          "text": "文件翻译",
          "type":0
        },
        {
          "iconPath": "/images/personal.png",
          "pagePath": "/pages/personal/index",
          "selectedIconPath": "/images/personal.png",
          "text": "个人中心",
          "type":0
        }
      ],
      showBottomNav:true,//是否显示底部tab
    lang: [
      "中文",
      "英语",
      "日语",
      "韩语",
      "法语",
      "德语",
      "俄语",
      "意大利语",
      "泰语",
      "越南语",
      "阿拉伯语",
      "保加利亚语",
      "捷克语",
      "丹麦语",
      "希腊语",
      "西班牙语",
      "芬兰语",
      "匈牙利语",
      "荷兰语",
      "波兰语",
      "葡萄牙语",
      "罗马尼亚语",
      "斯洛文尼亚语",
      "瑞典语",
    ],
    langCode: [
      "zh",
      "en",
      "jp",
      "ko",
      "fr",
      "de",
      "ru",
      "it",
      "th",
      "vi",
      "ar",
      "bul",
      "cs",
      "dan",
      "el",
      "spa",
      "fin",
      "hu",
      "nl",
      "pl",
      "pt",
      "rom",
      "slo",
      "swe",
    ],
    fromIdx: wx.getStorageSync('fromIdx') || 0,
    toIdx: wx.getStorageSync('toIdx') || 0,
  
    editLang:false,//是否在修改语言
      currentLang:app.globalData.currentLang,
      currentTargetLang:app.globalData.currentTargetLang
  }, 
  methods: {
    // 页面切换
      selectPage(e) {
          const { index, page, type } = e.currentTarget.dataset;
          console.warn(index, page, type ); 
          wx.switchTab({url:page}) 
          this.setData({
            selected: index, 
            showBottomNav: index==0?true:false
          }) 
          // app.checkBootomNav(index==0?true:false);
      }, 
      // 是否操作语言
      selectLang(e) { 
        console.warn("selectLang",this.data.editLang);  
        this.setData({
          editLang: this.data.editLang?false:true
        });
      },  
      // 获取语言配置
      getLangConfig() {
        wx.request({
          url: app.globalData.globalHost + "/api/translate/language",
          method: "GET",
          header: {
            "content-type": "application/json",
            Authorization: wx.getStorageSync("access_token"),
          },
          success: (res) => {
            if (res.data.code == 1) {
              let lang = res.data.data;
              let langArr = [];
              let codeArr = [];
              langArr.push('请选择')
              for (let i in lang) {
                langArr.push(lang[i]);
                codeArr.push(i);
              }
              this.setData({
                lang: langArr,
                langCode: codeArr,
              });
            } else {
              wx.showToast({ title: res.data.msg, icon: "none" });
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      },
      // 源语言改变
      fromIdxChange(e) {
        const dataset = e.target.dataset;
        console.warn("fromIdxChange",e);
        console.warn("fromIdxChange",dataset.index,dataset.langType);
        let changeLang = dataset.langType=="fromIdx"?{
          fromIdx: this.data.langCode.indexOf(dataset.index)
        }:{
          toIdx: this.data.langCode.indexOf(dataset.index)
        };
         this.setData(changeLang);
      },
      // 提交语言
      updateTranslateLang(){
        let changeLang = {
          
        };
        //导航栏当前语言
        this.setData({
          currentLang: this.data.lang[this.data.fromIdx],
          currentTargetLang: this.data.lang[this.data.toIdx]
        })
        this.selectLang();
        //提交数据到服务器
        //……………………
      },
      // 撤销语言修改语言
      oldTranslateLang(){
        this.selectLang()
      }
  }
})
