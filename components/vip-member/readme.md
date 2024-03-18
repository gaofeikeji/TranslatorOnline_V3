## 动作信息 指示 评价 和 支付 评价组件

1. 开发者工具：添加插件
2. 引用组件

```html
<!-- 引用组件内 -->

<!-- id 
支付场景值 
引用页面中展示则传入canShow：true 
alwaysShow:为true则每次展示 否则 每天展示 
onRateShowSuccess:调用成功 也就是除了 canShow 之外 的其他参数是否就绪。
onRateShowFail 调用失败
onRateSuccess 评价成功
onRateFail 评价失败 也就是用户没有评价
  -->
  <!-- 引用评价组件 -->
<ToRate
  id="rate"
  scene="{{scene}}"
  canShow="{{show_rate}}"
  rateScene="{{rateScene}}"
  alwaysShow="{{true}}"
  bind:RateShowSuccess="onRateShowSuccess"
  bind:RateShowFail="onRateShowFail"
  bind:RateSuccess="onRateSuccess"
  bind:RateFail="onRateFail"
/>
<!-- 引用 支付组件 -->
<vip-member id="pay"></vip-member>
```

```javascript
  // 其他需要声明的变量
  data:{
    rateScene: "",
    isShowOnceRate: false,
    isSuccessOnce: false, // 保存成功后 记录标志
  }
  // 声明 评价 组件
  this.rateComponent = this.selectComponent("#rate");
  this.rateComponent = this.selectComponent("#rate");
  // // test 清除评论
  // this.rateComponent.clearComment();

  // 展示提醒评分
  ToShowRate(rateScene){
    wx.showLoading({ title: "加载中", mask: true, });
    return new Promise((resolve, reject) => {
      this.setData({
        //是否展示过一次评价 防止出现因为后端配置导致或者上报评价不及时 展示了两次评价
        show_rate: this.data.isShowOnceRate ? false : true,
        //评价显示场景值
        rateScene: rateScene
      });
      // 只有在 评价场景值 为 before 的时候 才会去执行保存的回调
      if (rateScene == "before") {
        // before 情况下 如果已经通过其他方式成功过一次 当前的 提取 场景下就不再发起评价
        if (this.data.isSuccessOnce) {
          console.log("已经成功了，不需要再弹出前置评价");
          this.XXXXXXXXXXXXXXXXX();
          wx.hideLoading();
          resolve(); return;
        } else {
          this.rateComponent.judgeAndShow()
            .then((res) => { resolve(true); wx.hideLoading(); })
            .catch((err) => { reject(false); wx.hideLoading(); });
        }
        // 如果 是 保存结果后的评价 则不触发 成功的回调（成功的回调一般就是保存结果）
      } else {
        this.rateComponent.judgeAndShow()
          .then((res) => { resolve(true); wx.hideLoading(); })
          .catch((err) => { reject(false); wx.hideLoading(); });
        wx.hideLoading();
      }
    });
  },
  onRateSuccess: function (e) {
    console.log("success-index-评分成功", e);
    this.setData({
      show_rate: false,
      isShowOnceRate: true,
    });
    // 只有当评价场景是 before 才执行 回到
    this.data.rateScene == "before" && this.XXXXXXXXXXXXXXXXX();
  },
  onRateFail: function (e) {
    console.log("success-index-评分失败", e);
  },
  onRateShowFail: function (e) {
    console.log("success-index-评分展示失败 已经评过了 或者 关闭了评价的配置 ", e);
    // 只有当评价场景是 before 
    this.data.rateScene == "before" && this.XXXXXXXXXXXXXXXXX();
  },
  // 模拟点击 添加到我的小程序
  addMyMiniProgram(successCallback, failCallback) {
    console.log("去添加到我的小程序，模板3暂时不支持，直接去保存", successCallback, failCallback);
    successCallback();
  },
  // 模拟点击 广告
  showRewardAd(successCallback, failCallback) {
    console.log("去看广告，模板3暂时不支持，直接去保存");
    successCallback();
  },
  // ------------------------    支付组件    ------------------------
  // 保存结果前 调用 判断 
  onClickPreToJudgeActionInfo(_action_info, successFunc) {
    let that = this;
    return new Promise((resolve, reject) => {
      console.log("[## 后端指示的动作信息 ##]", _action_info);
      if (_action_info.before_action_type == 0) { successFunc(); resolve(); return; }
      if (_action_info.before_action_type == 1) {
        if (_action_info.other_pay_type == 99) {
          that.payComponent.process(() => { successFunc(); }, () => { });
          resolve(); return;
        } else {
          if (_action_info.other_pay_type == 0) {
            that.payComponent.process(() => { successFunc(); }, () => { successFunc(); }); resolve(); return;
          } else if (_action_info.other_pay_type == 2) {
            that.payComponent.process(() => { successFunc(); }, () => { that.ToShowRate('before'); }); resolve(); return;
          } else if (_action_info.other_pay_type == 3) {
            that.payComponent.process(() => { successFunc(); }, () => { that.addMyMiniProgram(() => { successFunc(); }, () => { successFunc(); }); }); resolve(); return;
          } else if (_action_info.other_pay_type == 4) {
            that.payComponent.process(() => { successFunc(); }, () => { that.showRewardAd(() => { successFunc(); }, () => { successFunc(); }); }); resolve(); return;
          }
        }
        resolve(); return;
      } else if (_action_info.before_action_type == 2) {
        that.ToShowRate('before'); resolve(); return;
      } else if (_action_info.before_action_type == 3) {
        that.addMyMiniProgram(() => { successFunc(); }, () => { successFunc(); }); resolve(); return;
      } else if (_action_info.before_action_type == 4) {
        that.showRewardAd(() => { successFunc(); }, () => { successFunc(); }); resolve(); return;
      }
    });
  }
  onClickAfterToJudgeActionInfo(_action_info) {
    console.log("点击了 我知道了 后去判断后端指示的动作信息"); let that = this;
    return new Promise((resolve, reject) => {
      console.log("[## 后置 指示的动作信息 ##]", _action_info);
      if (_action_info.after_action_type == 0) { resolve(); return; }
      if (_action_info.after_action_type == 1) {
        that.onClickPre(() => { }, () => { }); resolve();
      } else if (_action_info.after_action_type == 2) {
        that.ToShowRate('after'); resolve();
      } else if (_action_info.after_action_type == 3) {
        resolve();
      } else if (_action_info.after_action_type == 4) { resolve(); }
    });
  }

  savePre: function () {
    if (!this.data.isSuccessOnce)
      this.onClickPreToJudgeActionInfo(this.data.action_info,this.xxxxxxxxxxxxxxx)
    else
      this.saveOrCopy();
  }
  xxxxxxxxxxxxxxx(){
    let that = this;
    this.setData({ isSuccessOnce: true });
    success:{
      that.setData({ rateScene: 'after' });
      // 将保存 action_info 的数组传入
      that.onClickAfterToJudgeActionInfo(that.data.action_info)
    }
  }
```
