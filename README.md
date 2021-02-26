<!--
 * @Author: liujian
 * @Date: 2021-02-23 11:50:45
 * @Description: file content
 * @LastEditors: liujian
 * @LastEditTime: 2021-02-26 16:31:50
-->
# interview-ex
前端知识记录
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
 示例：postMessage, 运行： 分别通过`npm run start`运行admin1 和admin2项目，
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


    







<!-- <details>
<summary>CLICK ME</summary>

**<summary>标签与正文间一定要空一行！！！**
</details> -->

 
