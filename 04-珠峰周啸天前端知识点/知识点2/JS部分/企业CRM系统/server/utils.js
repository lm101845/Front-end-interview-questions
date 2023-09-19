const jwt = require('jsonwebtoken'),
    configToken = require('./package.json').config.token;
const { secret, maxAge } = configToken;

// 检测是否为纯粹对象
const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
};

// Token编译和解编译
const Token = {
    sign(data) {
        if (!isPlainObject(data)) return;
        return jwt.sign(data, secret, { expiresIn: maxAge });
    },
    verify(token) {
        try {
            let data = jwt.verify(token, secret);
            return {
                token: true,
                data
            };
        } catch (err) {
            return {
                token: false,
                data: err
            };
        }
    }
};

// JSON数据转换&过滤
const filter = function filter(data, nofilter) {
    try {
        data = JSON.parse(data);
    } catch (e) {
        data = [];
    }
    if (nofilter) return data;
    return data.filter(item => +item.state === 0);
};

// 服务器返回结果
const responsePublic = function responsePublic(res, flag = true, options) {
    if (!isPlainObject(options)) options = {};
    options = Object.assign({
        code: flag ? 0 : 1,
        codeText: flag ? 'OK' : 'NO'
    }, options);
    res.send(options);
};

// 延迟函数
const delay = function delay(interval) {
    typeof interval !== "number" ? interval = 1000 : null;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
};

// MD5二次加密处理
const handleMD5 = function handleMD5(val) {
    val = val.substring(4);
    val = val.split('').reverse().join('');
    val = val.substring(4);
    return val;
};

// 获取部门详细信息
const getDepartInfo = function getDepartInfo(departmentId, req) {
    let item = req.$departmentDATA.find(item => +item.id === +departmentId);
    if (!item) return {};
    let { id, name, desc } = item;
    return {
        id,
        name,
        desc
    };
};

// 获取职务详细信息
const getJobInfo = function getJobInfo(jobId, req) {
    let item = req.$jobDATA.find(item => +item.id === +jobId);
    if (!item) return {};
    let { id, name, desc, power } = item;
    return {
        id,
        name,
        desc,
        power
    };
};

// 获取员工详细信息
const getUserInfo = function getUserInfo(userId, req) {
    let item = req.$userDATA.find(item => +item.id === +userId);
    if (!item) return {};
    let { id, name, sex, email, phone, departmentId, jobId, desc } = item,
        jobInfo = getJobInfo(jobId, req);
    return {
        id,
        name,
        sex,
        email,
        phone,
        departmentId,
        department: getDepartInfo(departmentId, req).name || "",
        jobId,
        job: jobInfo.name || "",
        desc,
        power: jobInfo.power || "",
    };
};

// 获取客户详细信息
const getCustomerInfo = function getCustomerInfo(customerId, req) {
    let item = req.$customerDATA.find(item => +item.id === +customerId);
    if (!item) return {};
    let { id, name, sex, email, phone, QQ, weixin, type, address, userId, departmentId } = item;
    return {
        id,
        name,
        sex,
        email,
        phone,
        QQ,
        weixin,
        type,
        address,
        userId,
        userName: getUserInfo(userId, req).name || "",
        departmentId,
        department: getDepartInfo(departmentId, req).name || ""
    };
};

// 获取回访详细信息
const getVisitInfo = function getVisitInfo(visitId, req) {
    let item = req.$visitDATA.find(item => +item.id === +visitId);
    if (!item) return {};
    let { id, customerId, visitText, visitTime } = item;
    return {
        id,
        customerId,
        customerName: getCustomerInfo(customerId, req).name || "",
        visitText,
        visitTime
    };
};

module.exports = {
    Token,
    isPlainObject,
    filter,
    responsePublic,
    delay,
    handleMD5,
    getDepartInfo,
    getJobInfo,
    getUserInfo,
    getCustomerInfo,
    getVisitInfo
};