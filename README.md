<!--
 * @Author: liujian
 * @Date: 2021-02-23 11:50:45
 * @Description: file content
 * @LastEditors: liujian
 * @LastEditTime: 2021-02-24 18:09:49
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

 

    







<!-- <details>
<summary>CLICK ME</summary>

**<summary>标签与正文间一定要空一行！！！**
</details> -->

 
