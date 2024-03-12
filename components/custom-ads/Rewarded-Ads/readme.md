### 激励广告代码添加方法
 1. 在需要添加激励广告的页面引入文件
 ```js
 const { adVideoUtils } = require('../../components/custom-ads/Rewarded-Ads/index.js')
 ```
 2. 在页面中的onload()中加入
 ```js
  // 创建激励视频广告
  adVideoUtils.videoAdLoad('ad',() => {
    // this.copyContent() 此处函数是某个功能 比如下载功能，未加激励广告前 直接下载  加了广告后 广告播放完成再执行此函数
  })
 ```
 3. 在需要使用激励视频的位置加入显示广告 如：按钮点击事件
 ```js
  onClick() {
	  const isPlay = adVideoUtils.checkIsShowAd()
    if (!isPlay && adVideoUtils.videoAd) {
      wx.showModal({
        title: '温馨提示',
        content: '观看一次视频,即可免费下载.',
        success: (e) => {
          e.confirm && adVideoUtils.showAd()
        }
      })
    } else {
      this.copyContent()
    }
  }
 ```

 4. 例子：小程序页面中的代码
 ```js
 const { adVideoUtils } = require('../../components/custom-ads/Rewarded-Ads/index.js')

 // index.js 文件
 Page({
  onLoad() {
    // other code ....

    adVideoUtils.videoAdLoad('ad',() => {
      this.copyContent() // 此处函数是某个功能 比如复制内容
    })
  },
  // 功能函数
  copyContent() {
    // coding...

    wx.showToast({ title: '下载成功.', icon: 'success' })
  },
  gotoPlay() {
    const isPlay = adVideoUtils.checkIsShowAd()
    if (!isPlay && adVideoUtils.videoAd) {
      wx.showModal({
        title: '温馨提示',
        content: '观看一次视频,即可免费下载.',
        success: (e) => {
          e.confirm && adVideoUtils.showAd()
        }
      })
    } else {
      this.copyContent()
    }
  },
 })
 ```
 ```html
 <!-- 添加激励视频点击处 -->
 <button bind:tap="gotoPlay">点击下载</button>
 ```

  ## 添加强制广告方法
  - 放置在某个按钮的上面 需要把放置广告的上一层父级的样式设置为 position: relative;
  - 添加广告代码
  - 例：
  ```html
  <!-- 强制广告 -->
  <view class="relative-ad" style="position: relative">
    <button >测试</button>
    <custom-ads ad_type="6"></custom-ads>
  </view>
  ```

  ## 所有广告代码
  ```html
  <!-- 跳转小程序 -->
  <custom-ads ad_type="7">
    <view >
      <button data-name="btn" class="btn" bindtap="clickme">点我测试</button>
      <custom-ads ad_type="3"></custom-ads>
    </view>
  </custom-ads>
  <!-- 插屏广告 -->
  <custom-ads ad_type="1"></custom-ads> 
  <!-- 浮动广告 -->
  <custom-ads ad_type="2"></custom-ads>
  <!-- 插入Banner广告 -->
  <custom-ads ad_type="3" ad_pos="bottom"></custom-ads>
  <!-- 激励广告 具体看上面文档 -->
  <!-- 固定广告测试 -->
  <custom-ads ad_type="5"></custom-ads>
  <!-- 强制广告 -->
  <view class="relative-ad" style="margin-top: 200px;">
    <button >测试</button>
    <custom-ads ad_type="6"></custom-ads>
  </view>
  ```

  ## 添加反馈按钮
  <custom-ads ad_type="8"></custom-ads>

  # 添加到app.json中
  - 把目录 xunyuan_hao123 复制到 pages 目录下
  - "pages/xunyuan_hao123/index", 到 "pages" : [] 中
  
  
## 描述： 支付系统
### 1. 在使用支付的地方 引入：
```javascript
import { payMode } from '../../components/pay.js'
import { adVideoUtils } from '../../components/custom-ads/Rewarded-Ads/index.js'
```
### 2. 调用：
```javascript
    //查询是否是会员，如果是会员，直接保存，如果不是会员，弹出提示，观看视频后，保存
    /**
     * getHasBeenPayed 查询是否需要支付
     * @param {Function} successCallback 支付成功或者不需要支付回调
     * @param {Function} failCallback 支付失败回调
     */
    payMode.getHasBeenPayed(()=> {this.saveToPhotos()},()=>{this.onClick()})
```
### 3.查询监听：
```javascript
    // 成功跳转 则 执行 查询支付单状态
    onShow: function() {
		if(payMode.isJumpToPay){
		  payMode.pollingPayStatus();
		}
	},
```

### 使用方法
```
if(!isPlay) {
  payMode.getHasBeenPayed(()=> {
	this.viewReport(id)
  },()=>{
	if (adVideoUtils.videoAd) {
	  wx.showModal({
		title: '温馨提示',
		content: '观看视频,即可免费使用.',
		success: (e) => {
		  e.confirm && adVideoUtils.showAd()
		}
	  })
	} else {
	  this.viewReport(id)
	}
  })
} else {
  this.viewReport(id)
}
```