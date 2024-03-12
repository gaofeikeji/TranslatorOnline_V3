## 邀请评价组件

#### 组件介绍

从后台请求评价窗口的组件需要的文案

#### 以及是否要显示评价窗口 -----对于小程序来说 这属于全局开关

#### 使用方法

1. 开发者工具：添加插件
2. 引用组件
3. 引用评价插件

```json
{
  "usingComponents": {
    "ToRate": "/components/ToRate/ToRate"
  },
  "plugins": {
    "wxacommentplugin": {
      "version": "latest",
      "provider": "wx82e6ae1175f264fa"
    }
  }
}
```

```html
<!-- 引用组件内 -->
<!-- 展示时机  成功失败的事件监听 -->

<!-- id 
支付场景值 
引用页面中展示则传入canShow：true 
alwaysShow:为true则每次展示 否则 每天展示 
onRateShowSuccess:调用成功 也就是除了 canShow 之外 的其他参数是否就绪。
onRateShowFail 调用失败
onRateSuccess 评价成功
onRateFail 评价失败 也就是用户没有评价
  -->
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
```

```javascript
// 引用评价插件
  this.rateComponent = this.selectComponent("#rate");

// 发起评价
  this.rateComponent.judgeAndShow();
  
// 评价显示成功的回调   ------如果 是在获得结果前发起评价 则 需要加该回调
  // onRateShowSuccess onRateShowFail 该回调可以 避免 评价展示失败 导致阻塞后续逻辑
  onRateShowSuccess: function (e) {
    console.log("显示评分成功1111111111111111", e);
  },
  onRateShowFail: function (e) {
    console.log("显示评分失败1111111111111111", e);
  },

  onRateSuccess: function (e) {
    console.log("评分成功1111111111111111", e);
    if (this.data.rateScene == 'before') {
      this.xxxxxxxxx();
    }
  },
  onRateFail: function (e) {
    console.log("评分失败1111111111111111", e);

  },
  toShowRate: function () {
    this.setData({ show_rate: true });
    this.rateComponent.judgeAndShow();
  },
  // 强制弹出评价 
  toJudgeAndShowRate: function () {
    let that = this;
    // 请求该用户是否是支付过的状态
    console.log("【请求支付结果】");
    this.payComponent.getHasBeenPayedSelect(xxxx--scene--xxxxx).then((res) => {
      console.log("【请求到支付结果】", res);
      if (res.reason == 'paid') {
        wx.hideLoading();
        console.log("已支付");
        that.xxxxxxxxx();
        return;
      } else {
        that.rateComponent.getRequestComment().then((res) => {
          wx.hideLoading();
          let _comment_force_show = res.data.data.request_comment.comment_force_show;
          let _status = res.data.data.request_comment.status;
          console.log("【请求到评价结果】", res,"【强制评价】", _comment_force_show, "【需要评价状态是】", _status);
          if (_comment_force_show == true && _status == true) {
            that.setData({ rateScene: 'before' });
            that.toShowRate();
            return;
          } else {
            that.xxxxxxxxx();
          }
        });
      }
    }).catch((err) => {
          wx.hideLoading();
      console.log("【请求支付结果失败】", err);
      that.xxxxxxxxx();
    });
  },
```
