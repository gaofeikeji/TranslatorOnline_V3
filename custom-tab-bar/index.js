const app = getApp();
Component({ 
    // 接收父组件数据
  properties: {
    canBack: Boolean,  
    onytitle: Boolean,  
    title: String,  
    currentLang: { 
      type: String, 
      value: 'auto' 
    },
    currentTargetLang: { 
      type: String, 
      value: 'en' 
    },
  },

  data: { 
    lang: app.globalData.lang,
    langCode: app.globalData.langCode, 
    langData: app.globalData.langData,  
      editLang:false, 
      updateLang:"auto",
      updateTargetLang:"en",
      navBarHeight: app.globalData.navBarHeight, //导航栏高度
      menuBotton: app.globalData.menuBotton, //导航栏距离顶部距离
      menuRight: app.globalData.menuRight, //导航栏距离右侧距离
      menuHeight: app.globalData.menuHeight, //导航栏高度
      statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
      screenHeight: app.globalData.screenHeight, //可视区域高度  
  }, 
  methods: {
    // 读取语言数据
    getLangList(){ 
      const langData = wx.getStorageSync("langData");
      const lang = wx.getStorageSync("lang");
      const langCode = wx.getStorageSync("langCode"); 
      if(!langData||!lang||!langCode){
        return false;
      }
      this.setData({
        langData:langData,
        lang:lang,
        langCode:langCode, 
      }); 
    },
    // 返回翻译
    back() {
      console.warn(" wx.navigateBack");
      wx.navigateBack({
        delta: 1,
      }); 
    },
      // 是否操作语言
      selectLang(e) {  
        const lang = wx.getStorageSync("lang");
        const langCode = wx.getStorageSync("langCode");
        console.warn("getLangConfig:",lang);
        console.warn("getLangConfig:",langCode); 
        const tThis = this;
        if(lang&&langCode){
          this.getLangList();
        }else{
          app.getLangConfig(this.getLangList);
        }  
        
        this.setData({editLang:this.data.editLang?false:true});
        
      },  
       // 源语言改变
       fromIdxChange(e) {
        const dataset = e.target.dataset;
        console.warn("fromIdxChange",e);
        console.warn("fromIdxChange",dataset.index,dataset.langType);
        /**当前切换语言不会立即响应到全局，需要确认才会保存 */
        let changeLang = dataset.langType=="fromIdx"?{
          updateLang: dataset.index
        }:{
          updateTargetLang: dataset.index
        }; 
         this.setData(changeLang);
      },
      // 提交切换语言
      updateTranslateLang(){
        const updateLang = this.data.updateLang;
        const updateTargetLang = this.data.updateTargetLang;
        const newLang ={};
        
        //导航栏当前语言
        if(updateLang!==this.data.currentLang){
          newLang['currentLang']=updateLang;
        }
        if(updateTargetLang!==this.data.currentTargetLang){
          newLang['currentTargetLang']=updateTargetLang;
        }
        wx.setStorageSync("currentLang", updateLang); 
        wx.setStorageSync("currentTargetLang", updateTargetLang); 
        app.updateGlobalLang(updateLang,updateTargetLang);
        newLang.editLang=this.data.editLang?false:true;
        this.setData(newLang);
        console.warn("updateTranslateLang::",wx.getStorageSync("currentTargetLang"), wx.getStorageSync("currentLang"));  
        // this.selectLang();
        //提交数据到服务器
        //……………………
      },
      // 撤销语言修改语言
      oldTranslateLang(){ 
        app.showModalClose("未切换语言...",300);
        this.setData({editLang:this.data.editLang?false:true});
      } 
  }
})
