/*-CREATE SERVER-*/
const express = require('express'),
    app = express();
app.listen(1001, () => console.log(`服务启动成功,正在监听1001端口!`));

app.get('/user/list', (req, res) => {
    // 获取传递进来的callback值，例如：'func'
    let { callback } = req.query;
    // 准备数据
    let result = {
        code: 0,
        data: ['张三', '李四']
    };
    // 返回给客户端指定的格式，例如：’函数名(数据)‘
    res.send(`${callback}(${JSON.stringify(result)})`);
});

/* STATIC WEB */
app.use(express.static('./'));