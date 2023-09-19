/*
 什么是跨域请求(非同源策略请求)？
   对比地址：web页面的访问地址 VS 数据请求的接口地址
   如果 协议、域名、端口号 有任何一个不一样就是跨域请求、完全一致才是同源请求！ 

 浏览器默认的安全策略，是禁止基于ajax/fetch实现跨域访问的
   Access to XMLHttpRequest at 'http://127.0.0.1:9999/user/list' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains the invalid value ''.

 真实项目开发的时候，是同源请求多，还是跨域请求多？ --> 一般都是跨域访问
   @1 开发阶段是跨域、部署到服务器的时候是同源
     目前95%以上的项目都是“前后端分离开发”的，前端开发者在自己电脑上写项目，并且启动服务预览，而需要的数据，是去其他后台服务器获取，所以基本都是跨域请求！！
     最后代码开发完成，需要打包部署，此时可以把前后端代码都部署到相同服务器的同一个服务下，实现同源访问！
   @2 往往真实项目中，我们部署到服务器的时候
     + 前端的项目「Web资源」单独部署到Web服务器；
     + 后端的程序，单独部署到数据服务器；
     这样产品上线后也是跨域请求！！
   
 跨域解决方案：
   @1 Proxy跨域资源代理「优先推荐」
     原理：启动的一个“代理服务器”，一方面负责实现客户端页面的预览，一方面负责去真正的数据服务器获取前端需要的数据，并且给前端返回即可！！「浏览器和数据服务器之间存在域的限制，因为这是浏览器的安全策略；但是服务器和服务器之间是没有域的限制(不存在跨域问题)；」
     + 开发环境：webpack-dev-server
     + 生产环境：nginx

   @2 CORS跨域资源共享
     原理：由服务器端设置 Access-Control-Allow-Origin ，允许客户端向他发请求即可
       设置的语法：response.header("Access-Control-Allow-Origin", "");
       + 允许的源可以是某个源 http://127.0.0.1:5500
       + 可以是所有源 *
         + 不推荐这种方式，因为不安全
         + 而且一但设置为*，则Credentials必须是false，也就是不允许携带资源凭证
       + 默认不支持设置多个源，所以我们采用“白名单机制”
     我们一般还要设置允许哪些请求方式、哪些请求头、是否携带资源凭证...
       + 如果服务器端设置了 response.header("Access-Control-Allow-Credentials", true); 则客户端也要设置 axios.defaults.withCredentials=true 和其对应！
     基于CORS实现跨域的时候，浏览器在发送真正的请求之前，先发一个OPTIONS试探请求，看看能否通信成功，如果可以成功，再发送真实的请求！！

   @3 JSONP
     原理：浏览器的安全策略会限制ajax数据请求，但是不会限制<link>\<script>等资源的请求，也就是<script>不存在域的限制！！而JSONP这种跨域解决方案，就是利用了这个机制，实现跨域数据请求的！！
     + 是基于<script>发送请求：需要浏览器把返回的字符串当做JS代码执行
     + 创建的函数一定是“全局函数”：保证后期执行的时候可以找到这个函数
     + 每次发请求，要基于callback(名字可以随便起，只要服务器配合起来即可)把全局函数名给服务器
     + 需要服务器的特殊配合「返回的结果组成 “函数名(数据)” 字符串」
     + 只能发送GET请求：因为用的是<script>获取资源，只能是GET请求，无法基于JSONP实现POST请求！！
   -----
   postMessage
   document.domain+iframe
   location.hash+iframe
   window.name+iframe
   ...
 */

/* jsonp('http://127.0.0.1:1001/user/list2').then(value => {
    console.log('成功:', value);
}).catch(reason => {
    console.log('失败:', reason);
}); */

jsonp('https://www.baidu.com/sugrec', {
    params: {
        prod: 'pc',
        wd: '珠峰培训'
    },
    jsonpName: 'cb'
}).then(value => {
    console.log('成功:', value);
}).catch(reason => {
    console.log('失败:', reason);
}); 