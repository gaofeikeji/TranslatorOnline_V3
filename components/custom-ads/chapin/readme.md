### 事件插屏广告代码添加方法
 1. 在需要添加插屏广告的页面引入文件
```js
import { adUtils } from '../../components/custom-ads/chapin/index.js'
```

 2. 在页面中的onload()中加入
 ```js
  // 初始化插屏广告
  adUtils.chaPingAdLoad()
 ```
 3. 在需要使用插屏广告的位置加入显示广告 如：按钮点击事件
 ```js
  onClick() {
    adUtils.showChaPing()
    // 如果要加延时弹出 请自行写setTimeout
    // setTimeout(() => {
    //   adUtils.showChaPing()
    // }, 600)
  }
 ```