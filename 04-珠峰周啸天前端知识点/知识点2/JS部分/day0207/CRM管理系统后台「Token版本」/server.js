const express = require('express'),
    bodyparser = require('body-parser'),
    fs = require('fs').promises,
    path = require('path');

const pathdb = path.resolve(__dirname, 'database'),
    pathroutes = path.resolve(__dirname, 'routes'),
    config = require('./package.json').config,
    server = config.server,
    { open, safeList } = config.cros,
    { Token, filter, responsePublic } = require('./utils');

/*-创建&启动服务-*/
const app = express();
app.listen(server, () => {
    console.log(`THE WEB SERVICE SUCCESSFULLY AND LISTENING TO THE PORT：${server}!`);
});

/*-中间件-*/
if (open) {
    // 支持CROS跨域
    app.use((req, res, next) => {
        let origin = req.headers.origin || req.headers.referer || "";
        origin = origin.replace(/\/$/g, '');
        origin = !safeList.includes(origin) ? '' : origin;
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Methods", 'GET,POST,HEAD,DELETE,PUT,OPTIONS,PATCH');
        res.header("Access-Control-Allow-Headers", 'authorzation,Authorization,Accept,Origin,Keep-Alive,User-Agent,X-Data-Type,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
        req.method === 'OPTIONS' ? res.send() : next();
    });
}
// 请求主体信息
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// 获取数据
app.use(async (req, _, next) => {
    req.$customerDATA = filter(await fs.readFile(`${pathdb}/customer.json`, 'utf-8'));
    req.$departmentDATA = filter(await fs.readFile(`${pathdb}/department.json`, 'utf-8'));
    req.$jobDATA = filter(await fs.readFile(`${pathdb}/job.json`, 'utf-8'));
    req.$userDATA = filter(await fs.readFile(`${pathdb}/user.json`, 'utf-8'));
    req.$visitDATA = filter(await fs.readFile(`${pathdb}/visit.json`, 'utf-8'));
    next();
});

/*-校验登录态-*/
app.use(async (req, res, next) => {
    // 不需要Token的接口
    if (req.path === '/user/login' && req.method.toUpperCase() === 'POST') {
        next();
        return;
    }
    // 校验Token的合法性
    let authorzation = req.headers['authorzation'];
    let { token, data } = Token.verify(authorzation);
    if (!token) {
        responsePublic(res, false, {
            codeText: 'no permission to access, possibly because you are not logged in or your login has expired'
        });
        return;
    }
    req.$TOKEN = data;
    next();
});

/*-前端路由-*/
app.use('/user', require(`${pathroutes}/user`));
app.use('/customer', require(`${pathroutes}/customer`));
app.use('/department', require(`${pathroutes}/department`));
app.use('/visit', require(`${pathroutes}/visit`));
app.use('/job', require(`${pathroutes}/job`));

/*-静态页面&404-*/
app.use(express.static('./static'));
app.use((_, res) => {
    res.status(404);
    res.send();
});