/*-CREATE SERVER-*/
const express = require('express'),
    request = require('request'),
    app = express();
app.listen(1001, () => console.log(`服务启动成功,正在监听1001端口!`));

// 服务器接收到客户端发送过来的请求
app.get('/aaa', (req, res) => {
    // 向简书发送相同请求，从简书服务器获取想要的数据「不存在域的限制的」
    let jianURL = `https://www.jianshu.com/asimov/subscriptions/recommended_collections`;
    req.pipe(request(jianURL)).pipe(res);
});

/* STATIC WEB */
app.use(express.static('./'));