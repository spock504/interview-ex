<!--
 * @Author: liujian
 * @Date: 2021-02-23 11:50:45
 * @Description: file content
 * @LastEditors: liujian
 * @LastEditTime: 2021-03-15 11:26:52
-->
目录:
[toc]

## 1. js部分
#### 1. 实现图片懒加载
判断图片所在位置是否在可视区内，图片移到可视区内进行加载
 1. offsetTop < clientHeight + scrollTop
 2. IntersectionObserver
       使用IntersectionObserver实现图片 懒加载, 示例文件位置：`lazyImgs.html`  
        [谈谈IntersectionObserver懒加载](https://www.jianshu.com/p/84a86e41eb2b)
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
 
 示例文件位置：`postMessage` 运行： 分别通过`npm run start`运行admin1 和admin2项目，
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
示例文件位置：`addEventListener.html`  
优点:
- 提高性能：只需添加一个事件代理所有事件，代码量少，所占用的内存空间更少。
- 动态监听：自动绑定动态添加的元素

#### 6. js 改变url，并且页面不刷新  
1. 使用 location.hash 属性来修改锚部分：`window.addEventListener("hashchange", myFunction);`
2. 使用 history.pushState()方法：`history.pushState(state, title, url);`
运行：`npm run starturl `，查看操作效果。 
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
示例文件位置：`eventEmiter.js`

#### 9. 使用 requestAnimationFrame
`requestAnimationFrame`：基于帧数执行， 每秒60次
在下次重绘时执行函数（当页面隐藏，也就是你在屏幕上看不到时，会自动暂停绘制） 
`cancelAnimationFrame()`：取消回调函数  


## 2. css部分

#### 1. rem 实现自适应布局
示例文件位置：`rem.html`
rem单位只相对于浏览器的根元素（HTML元素）的font-size，只需要根据视图容器的大小，动态的改变font-size即可。
  一般的，各大主流浏览器的font-size默认值为16px,设置了62.5%以后就有 1rem=10px
  ```css
  html,body{
     font-size: 62.5%;  
  }
  ```

#### 2. 移动端 1px
 `::after` + `transform`: 通过缩放边框实现1px
 设备像素比（DPR） = 设备像素（物理像素） / 设备独立像素（逻辑像素）

## 3.性能优化
1. 代码压缩
    - 无效字符的删除
    - 剔除注释
2. 非核心代码异步加载
    - script标签使用async和defer
      - async是在加载完之后立即执行，并且多个执行顺序和加载顺序无关
      - defer会在HTML解析完之后执行,并且多个defer会按照顺序执行
    - 如果是react, 可以使用lazy页面路由异步加载
3. [图片懒加载](####1.实现图片懒加载)
4. 浏览器缓存



参考链接：[页面性能优化办法有哪些？](https://zhuanlan.zhihu.com/p/67098966?utm_source=wechat_timeline)

## 4.http

 


 



    







<!-- <details>
<summary>CLICK ME</summary>

**<summary>标签与正文间一定要空一行！！！**
</details> -->

 
