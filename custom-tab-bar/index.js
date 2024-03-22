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
      menuWidth: app.globalData.menuWidth, //导航栏距离右侧距离
      menuHeight: app.globalData.menuHeight, //导航栏高度
      statusBarHeight: app.globalData.statusBarHeight, //状态栏栏高度
      screenHeight: app.globalData.screenHeight, //可视区域高度  
      screenWidth: app.globalData.screenWidth , //可视区域高度  
      menuLeftwidth: app.globalData.menuLeftwidth , //可视区域高度  
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
    back(e) {
      var that = this
      // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
      if (that.data.touchEndTime - that.data.touchStartTime < 350) {
        // 当前点击的时间
        var currentTime = e.timeStamp
        var lastTapTime = that.data.lastTapTime
        // 更新最后一次点击时间
        that.data.lastTapTime = currentTime
        // 如果两次点击时间在200毫秒内，则认为是双击事件
        if (currentTime - lastTapTime < 200) {
          // 双击事件
          clearTimeout(that.data.lastTapTimeoutFunc);
          console.log("double click")
          wx.redirectTo({
            url: 'index?actionid=1'
          })
        } else {
          that.data.lastTapTimeoutFunc = setTimeout(function () {
                      // 单击事件
            console.log("double click")
            wx.redirectTo({
              url: 'index?actionid=2'
            })
          }, 200);
        }
      }else{
        
        console.warn(" wx.点击了一次");
        wx.navigateBack({
          delta: 1,
        }); 
      }
    },
      // 是否操作语言
      selectLang(e) {  
        const lang = wx.getStorageSync("lang");
        const langCode = wx.getStorageSync("langCode");
        let langData = wx.setStorageSync("langData")
        // console.warn("getLangConfig:",lang); console.warn("getLangConfig:",langCode);
        const tThis = this;
        if(lang&&langCode){
          langData = this.getLangList();
        }else{
          // 异步请求并更新语言
          app.getLangConfig(this.getLangList);
        }  
        
        this.setData({
          editLang:this.data.editLang?false:true,
          langData:langData
        }); 
      },  
       // 源语言改变
       fromIdxChange(e) {
        const dataset = e.target.dataset;
        /**当前切换语言不会立即响应到全局，需要确认才会保存 */
        let changeLang = {};
        const oldLang= app.getCurrentLang(this);  
        if(dataset.langType=="fromIdx"){//源语言切换
          if(dataset.index==oldLang.currentTargetLang){
            wx.showToast({
              title: '源语言和目标语言不能一致',
              icon: 'success',
              duration: 2000
            })
            return false;
          }
          changeLang.updateLang=dataset.index;
        }else{//目标语言切换
          if(dataset.index==oldLang.currentLang){
            wx.showToast({
              title: '源语言和目标语言不能一致',
              icon: 'success',
              duration: 2000
            })
            return false;
          }

          changeLang.updateTargetLang=dataset.index;
        } 

        if(dataset){

        }
         this.setData(changeLang);
      },
      // 提交切换语言
      updateTranslateLang(){
        const updateLang = this.data.updateLang||"auto";
        const updateTargetLang = this.data.updateTargetLang||"en";
        const newLang ={};
        
        //导航栏当前语言
          newLang['currentLang']=updateLang;
          newLang['currentTargetLang']=updateTargetLang;
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
