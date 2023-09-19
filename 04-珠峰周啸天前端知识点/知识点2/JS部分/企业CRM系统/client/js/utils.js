String.prototype.queryParams = function queryParams(attr) {
    let obj = {};
    let self = this;
    self.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, $1, $2) => {
        obj[$1] = $2;
    })
    return attr != undefined ? obj[attr] : obj;
};

/* 设计公共的方法{功能方法} */
(function () {
    // 实现具备有效期的LocalStorage存储
    const storage = {
        set(name, value) {
            let data = {
                time: +new Date(),
                value
            };
            localStorage.setItem(name, JSON.stringify(data));
        },
        get(name, cycle = 2592000000) {
            let data = localStorage.getItem(name);
            if (!data) return null;
            data = JSON.parse(data);
            if ((+new Date() - data.time) > cycle) {
                // 过期了
                storage.remove(name);
                return null;
            }
            return data.value;
        },
        remove(name) {
            localStorage.removeItem(name);
        }
    };

    /* 暴露API */
    const utils = {
        storage
    };
    window._ = window.utils = utils;
})();


/* 再写一个闭包，用来管理业务逻辑上的公用部分 */
(function () {
    // 获取部门列表
    const queryDepartmentList = async function queryDepartmentList() {
        // 首先看本地是否具备有效的缓存信息
        let value = _.storage.get('departmentList');
        if (value) return value;

        // 不具备缓存，再从服务器获取
        let departmentList = [];
        try {
            let { code, data } = await axios.get('/department/list');
            if (+code === 0) {
                departmentList = data;
                // 把获取的信息缓存在本地
                _.storage.set('departmentList', departmentList);
            }
        } catch (_) { }
        return departmentList;
    };

    // 获取职务列表
    const queryJobList = async function queryJobList() {
        let value = _.storage.get('jobList');
        if (value) return value;
        let jobList = [];
        try {
            let { code, data } = await axios.get('/job/list');
            if (+code === 0) {
                jobList = data;
                _.storage.set('jobList', jobList);
            }
        } catch (_) { }
        return jobList;
    };

    // 表单校验:检验真实姓名
    const validateName = function validateName(inp, inpTip) {
        let val = inp.value.trim(),
            reg = /^(?:[\u4e00-\u9fa5·]{2,16})$/;
        if (val.length === 0) {
            inpTip.innerHTML = '用户名不能为空';
            return false;
        }
        if (!reg.test(val)) {
            inpTip.innerHTML = '用户名格式不正确';
            return false;
        }
        inpTip.innerHTML = '';
        return true;
    };

    // 表单校验:检验邮箱
    const validateEmial = function validateEmial(inp, inpTip) {
        let val = inp.value.trim(),
            reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (val.length === 0) {
            inpTip.innerHTML = '邮箱不能为空';
            return false;
        }
        if (!reg.test(val)) {
            inpTip.innerHTML = '邮箱格式不正确';
            return false;
        }
        inpTip.innerHTML = '';
        return true;
    };

    // 表单校验:检验手机号
    const validatePhone = function validatePhone(inp, inpTip) {
        let val = inp.value.trim(),
            reg = /^(?:(?:\+|00)86)?1\d{10}$/;
        if (val.length === 0) {
            inpTip.innerHTML = '手机号不能为空';
            return false;
        }
        if (!reg.test(val)) {
            inpTip.innerHTML = '手机号格式不正确';
            return false;
        }
        inpTip.innerHTML = '';
        return true;
    };

    /* 暴露API */
    const common = {
        queryDepartmentList,
        queryJobList,
        validateName,
        validateEmial,
        validatePhone
    };
    window.common = common;
})();