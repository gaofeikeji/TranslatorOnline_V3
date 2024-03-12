### 支付组件使用说明：

1. 复制wx-pay目录到components目录下
2. 在app.json中 "usingComponents"下添加 "wxPay": "/components/wx-pay/index",
3. 在需要支付的页面中  添加 
<wxPay id="pay" scene="{{}}" without="1" bind:payment="wxPayment" mtop="40%"></wxPay>
  1> id的作用：为获取组件的实例使用
  2> scene场景值：不传递时 默认为 template_unlock 
  3> bind:payment="wxPayment" 自定义事件
  4> mtop="40%" 可自由控制距离顶部多少距离 不填有默认值
  5> without="1" 跳转到外部支付  默认不填为0  在内部支付

```js
// 在js代码中使用方法 例：

onLoad:function() {
  // 获取子组件实例 #pay 为设置的 id
  this.payComponent = this.selectComponent("#pay")
},

onShow: function () {
  if (this.payComponent.data.isJumpToPay) {
    this.payComponent.pollingPayStatus()
  }
},
// 功能
viewRes: function(e) {
  let id = e.currentTarget.dataset.id
  wx.setStorageSync('currentId', id);
  // 判断是否已经支付
  this.payComponent.checkPayStatus({
    successFunc: () => {
      console.log('已支付')
      this.viewReport(id)
    },
    failFunc: () => {
      console.log('未支付')
      this.payComponent.openPay()
      // 首次支付弹窗
      if (this.payComponent.data.isOnce && !this.payComponent.data.isViewCoupon) {
        this.wxPayment()
      }
      // 只显示无折扣券弹窗
      if (!this.payComponent.data.isOnce && !this.payComponent.data.isViewCoupon) {
        this.payComponent.immediatePayment()
        this.wxPayment()
      }
      // 显示过折扣券弹窗
      if (!this.payComponent.data.isOnce && this.payComponent.data.isViewCoupon) {
        this.payComponent.discount()
        this.wxPayment()
      }
    }
  })
},
wxPayment: function(e) {
  console.log('[*] 自定义事件传过来的信息:',e)
  const id = wx.getStorageSync('currentId')
  if (e) {
    this.payComponent.getHasBeenPayed(() => {
      console.log('已支付')
      this.viewReport(id)
    }, () => {
      console.log('未支付')
    }, e.detail.coupon_id)
  }
},

```