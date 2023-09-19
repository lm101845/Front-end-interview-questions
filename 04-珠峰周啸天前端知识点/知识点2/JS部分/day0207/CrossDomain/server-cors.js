/*-CREATE SERVER-*/
const express = require('express'),
	app = express();
app.listen(1001, () => console.log(`服务启动成功,正在监听1001端口!`));

/*-MIDDLE WARE-*/
// 设置白名单
let safeList = ["http://127.0.0.1:8848","http://127.0.0.1:5500", "http://127.0.0.1:3000", "http://127.0.0.1:8080"];
app.use((req, res, next) => {
	let origin = req.headers.origin || req.headers.referer || "";
	origin = origin.replace(/\/$/g, '');
	origin = !safeList.includes(origin) ? '' : origin;
	res.header("Access-Control-Allow-Origin", origin);
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,HEAD");
	req.method === 'OPTIONS' ? res.send('OK') : next();
});

/*-API-*/
app.get('/list', (_, res) => {
	res.send({
		code: 0,
		message: 'zhufeng'
	});
});

/* STATIC WEB */
app.use(express.static('./'));