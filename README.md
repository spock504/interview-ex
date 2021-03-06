<!--
 * @Author: liujian
 * @Date: 2021-02-23 11:50:45
 * @Description: file content
 * @LastEditors: liujian
 * @LastEditTime: 2021-04-20 13:46:08
-->
目录:
- [1. js部分](#1-js部分)
    - [1. 实现图片懒加载](#1-实现图片懒加载)
    - [2. 跨域](#2-跨域)
    - [3. 浏览器原理](#3-浏览器原理)
    - [4. 检测类型](#4-检测类型)
    - [5. 事件冒泡](#5-事件冒泡)
    - [6. js 改变url，并且页面不刷新](#6-js-改变url并且页面不刷新)
    - [7. js中自定义事件的使用与触发](#7-js中自定义事件的使用与触发)
    - [8.实现简单的EventEmiter，包含事件绑定，事件触发以及移除](#8实现简单的eventemiter包含事件绑定事件触发以及移除)
    - [9. 使用 requestAnimationFrame](#9-使用-requestanimationframe)
- [2. css部分](#2-css部分)
    - [1. rem 实现自适应布局](#1-rem-实现自适应布局)
    - [2. 移动端 1px](#2-移动端-1px)
- [3.性能优化](#3性能优化)
- [4.http](#4http)

## 1. js部分
#### 1. 实现图片懒加载
判断图片所在位置是否在可视区内，图片移到可视区内进行加载
1. IntersectionObserver  
       使用IntersectionObserver实现图片 懒加载   
       示例文件位置：`js/lazyImgs.html`  
        [谈谈IntersectionObserver懒加载](https://www.jianshu.com/p/84a86e41eb2b)
2. getBoundingClientRect 用于获取某个元素相对于视窗的位置集合
   示例文件位置： `js/lazyImgs.html` （如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出）
   也能够用来实现[吸顶效果](https://www.jianshu.com/p/824eb6f9dda4)
3. 触底判断
    `const isBottom = (clientHeight + scrollTop === scrollHeight)`
    `clientHeight`：它是元素内部的高度，包含内边距，但不包括水平滚动条、边框和外边距。
    `scrollTop`： 元素内容顶部到它的视口可见内容（的顶部）的距离。当一个元素的内容没有产生垂直方向的滚动条，那么它的 scrollTop 值为0。
    `scrollHeight`：这个只读属性是一个元素内容高度的度量，包括由于溢出导致的视图中不可见内容。
#### 2. 跨域
[前端常见跨域解决方案（全）](https://segmentfault.com/a/1190000011145364)  

同源是指"协议+域名+端口"三者相同 
 1.  通过jsonp跨域 (只能实现get一种请求。)
 原理： 用户传递一个callback给服务端，然后服务端返回数据时会将这个callback 函数名给前端执行。
> 通常为了减轻web服务器的负载，我们把js、css，img等静态资源分离到另一台独立域名的服务器上，在html页面中再通过相应的标签从不同域名下加载静态资源  

jquery 实现： 
```
$.ajax({
    url: 'http://www.domain2.com:8080/login',
    type: 'get',
    dataType: 'jsonp',  // 请求方式为jsonp
    jsonpCallback: "handleCallback",    // 自定义回调函数名
    data: {}
});
```
 2. 跨域资源共享（CORS）
        只服务端设置Access-Control-Allow-Origin即可
 3. nginx代理跨域
 nginx配置解决iconfont跨域:
 ```
 location / {
  add_header Access-Control-Allow-Origin *;
}
 ```
nginx反向代理接口跨域:
```
#proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;

    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        index  index.html index.htm;
    }
}
```
 
 4. postMessage
 postMessage(data,origin) 方法接受两个参数.
 
 示例文件位置：`postMessage`文件下 ，运行： 分别通过`npm run start`运行admin1 和admin2项目，
 > *admin1* 中：iframe.contentWindow.postMessage()发送数据，并且通过window.addEventListener('message', function (e) {}) 接收数据
 *admin2* 中：通过window.addEventListener('message', function (e) {}) 接收数据，然后通过window.parent.postMessage() 将数据返回给admin1中
 
#### 3. 浏览器原理
[浏览器工作原理](https://segmentfault.com/a/1190000022633988)
 在Chrome中，主要的进程有4个：
> 1. 浏览器进程 (Browser Process)：负责浏览器的TAB的前进、后退、地址栏、书签栏的工作和 处理浏览器的一些不可见的底层操作，比如网络请求和文件访问。  
> 2. 渲染进程 (Renderer Process)：负责一个Tab内的显示相关的工作，也称渲染引擎。
> 3. 插件进程 (Plugin Process)：负责控制网页使用到的插件
> 4. GPU进程 (GPU Process)：负责处理整个应用程序的GPU任务

#### 4. 检测类型
1. `typeof`: 会将null当作对象类型，由于js在底层存储变量的时候会在变量的机器码的低位1-3位存储其类型信息(000：对象，010：浮点数，100：字符串，110：布尔，1：整数)，但是null所有机器码均为0，直接被当做了对象来看待
```js
typeof {} // object
typeof [] // object
typeof null // object
```
2. `Object.prototype.toString.call()`用于检验数据类型比较准确。
```js
Object.prototype.toString.call({})   // "[object Object]"
Object.prototype.toString.call([])   // "[object Array]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(1)    // "[object Number]"
```

#### 5. 事件冒泡
事件委托就是利用冒泡的原理，把事件加到父元素上，触发执行效果。
```js
addEventListener(type,listener,useCapture) , 其中useCapture默认false 冒泡
```
示例文件位置：`js/addEventListener.html`  
优点:
- 提高性能：只需添加一个事件代理所有事件，代码量少，所占用的内存空间更少。
- 动态监听：自动绑定动态添加的元素

#### 6. js 改变url，并且页面不刷新  
示例文件位置：`js/url.html`  
1. 使用 location.hash 属性来修改锚部分：`window.addEventListener("hashchange", myFunction);`
2. 使用 history.pushState()方法：`history.pushState(state, title, url);`
项目根目录运行：`npm run starturl `，查看操作效果。 
参考链接：[张鑫旭 history pushState/replaceState实例](https://www.zhangxinxu.com/wordpress/2013/06/html5-history-api-pushstate-replacestate-ajax/)

#### 7. js中自定义事件的使用与触发
```js
var event = new Event('build');

// Listen for the event.
window.addEventListener('build', function (e) { 
    console.log("build event")
 }, false);

// Dispatch the event.
window.dispatchEvent(event);
```
#### 8.实现简单的EventEmiter，包含事件绑定，事件触发以及移除
示例文件位置：`js/eventEmiter.js`

#### 9. 使用 requestAnimationFrame
`requestAnimationFrame`：基于帧数执行， 每秒60次
在下次重绘时执行函数（当页面隐藏，也就是你在屏幕上看不到时，会自动暂停绘制） 
`cancelAnimationFrame()`：取消回调函数  


## 2. css部分

#### 1. rem 实现自适应布局
示例文件位置：`css/rem.html`
rem单位只相对于浏览器的根元素（HTML元素）的font-size，只需要根据视图容器的大小，动态的改变font-size即可。
  一般的，各大主流浏览器的font-size默认值为16px,设置了62.5%以后就有 1rem=10px
  ```css
  html, body{
     font-size: 62.5%;  
  }
  ```

#### 2. 移动端 1px
示例文件位置：`css/rem.html`  
 `::after` + `transform`: 通过缩放边框实现1px
 设备像素比（DPR） = 设备像素（物理像素） / 设备独立像素（逻辑像素）
 ```css
.borderPx {
    position: relative;
}

.borderPx::after {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1px solid rgb(211, 74, 74);
    content: "";
    transform: scaleY(0.5);
    transform-origin: left top;
}
 ```

## 3.性能优化
1. 代码压缩
    - 无效字符的删除
    - 剔除注释
2. 非核心代码异步加载
    - script标签使用async和defer
      - async是在加载完之后立即执行，并且多个执行顺序和加载顺序无关
      - defer会在HTML解析完之后执行，并且多个defer会按照顺序执行
    - 如果是react, 可以使用lazy页面路由异步加载
3. [图片懒加载](#1-实现图片懒加载)
4. 浏览器缓存
   1. 强缓存：不会向服务器发送请求，直接从缓存中读取资源
      1. Catch-Control：max-age=30 表示客户端将该缓存最多保存30s
         **Catch-Control 设置时间长度**
      2. Expires: Thu,21 Jan 2021 23:39:02 GMT
         **设置过期时间点，响应头包含日期/时间（本地时间，不靠谱）**
   2. 协商缓存：向服务器发送请求
        协商缓存需要与cache-control共同使用
      1. Last-Modified
        发起请求时，若传递的时间值与服务器上该资源最终修改时间是一致的，则说明该资源没有被修改过，直接返回304状态码，内容为空.
        > 但last-modified 存在一些缺点：
        >
        >   Ⅰ. 某些服务端不能获取精确的修改时间
        >   Ⅱ. 文件修改时间改了，但文件内容却没有变
      2. Etag
        是对该资源的一种唯一标识，只要资源有变化，Etag就会重新生成。
参考链接：[页面性能优化办法有哪些？](https://zhuanlan.zhihu.com/p/67098966?utm_source=wechat_timeline)

## 4.http

 


 



    







<!-- <details>
<summary>CLICK ME</summary>

**<summary>标签与正文间一定要空一行！！！**
</details> -->

 
