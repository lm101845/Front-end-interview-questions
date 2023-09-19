(function () {
    let listeners = {};

    // 向事件池中追加方法
    const on = function on(type, func) {
        let arr = listeners[type];
        if (!arr) {
            listeners[type] = [];
            arr = listeners[type];
        }
        if (arr.includes(func)) return;
        arr.push(func);
    };

    // 从事件池中移除方法
    const off = function off(type, func) {
        let arr = listeners[type] || [],
            index = arr.indexOf(func);
        if (index === -1) return;
        arr[index] = null;
    };

    // 通知事件池中指定的方法执行
    const emit = function emit(type, ...params) {
        let arr = listeners[type] || [],
            i = 0,
            item;
        for (; i < arr.length; i++) {
            item = arr[i];
            if (typeof item === "function") {
                item(...params);
                continue;
            }
            arr.splice(i, 1);
            i--;
        }
    };

    /* 暴露API */
    let $sub = {
        on,
        off,
        emit
    };
    if (typeof module === "object" && typeof module.exports === "object") module.exports = $sub;
    if (typeof window !== "undefined") window.$sub = $sub;
})();

(async function () {
    let baseBox = document.querySelector('.baseBox'),
        baseText = baseBox.querySelector('span'),
        signoutBtn = baseBox.querySelector('a'),
        menuBox = document.querySelector('.menuBox'),
        navBox = document.querySelector('.navBox');

    // 获取用户信息展示
    const bindBaseInfo = async function bindBaseInfo() {
        let {
            code,
            data
        } = await axios.get('/user/info');
        if (+code === 0) {
            baseText.innerHTML = `${data.name}`;
        }
    };
    $sub.on('INDEX', bindBaseInfo);

    // 退出登录
    const signout = function signout() {
        signoutBtn.onclick = async function () {
            // 给用户对应的提示
            let flag = confirm('小主，您确定要退出登录吗？');
            if (!flag) return;
            // 点击的是确定
            await axios.get('/user/signout');
            location.href = 'login.html';
        };
    };
    $sub.on('INDEX', signout);

    // 权限判断
    const checkPower = async function checkPower() {
        let {
            code,
            power
        } = await axios.get('/user/power');
        if (+code === 1) return;

        // 根据权限控制MENU的渲染
        let str = ``;
        // 客户管理
        str += `<div class="itemBox" text="客户管理">
            <h3>
                <i class="iconfont icon-kehuguanli"></i>
                客户管理
            </h3>
            <nav class="item">
                <a href="page/customerlist.html?lx=my" target="iframeBox">我的客户</a>
                ${
                    power.includes('customerall')?
                    `<a href="page/customerlist.html?lx=all" target="iframeBox">全部客户</a>`:
                    ``
                }
                <a href="page/customeradd.html" target="iframeBox">新增客户</a>
            </nav>
        </div>`;
        // 员工管理
        if (power.includes('userhandle')) {
            str += `<div class="itemBox" text="员工管理">
                <h3>
                    <i class="iconfont icon-yuangong"></i>
                    员工管理
                </h3>
                <nav class="item">
                    <a href="page/userlist.html" target="iframeBox">员工列表</a>
                    <a href="page/useradd.html" target="iframeBox">新增员工</a>
                </nav>
            </div>`;
        }
        // 部门管理 
        if (power.includes('departhandle')) {
            str += `<div class="itemBox" text="部门管理">
                <h3>
                    <i class="iconfont icon-guanliyuan"></i>
                    部门管理
                </h3>
                <nav class="item">
                    <a href="page/departmentlist.html" target="iframeBox">部门列表</a>
                    <a href="page/departmentadd.html" target="iframeBox">新增部门</a>
                </nav>
            </div>`;
        }
        // 职务管理
        if (power.includes('jobhandle')) {
            str += `<div class="itemBox" text="职务管理">
                <h3>
                    <i class="iconfont icon-zhiwuguanli"></i>
                    职务管理
                </h3>
                <nav class="item">
                    <a href="page/joblist.html" target="iframeBox">职务列表</a>
                    <a href="page/jobadd.html" target="iframeBox">新增职务</a>
                </nav>
            </div>`;
        }
        menuBox.innerHTML = str;

        // 点击主导航的切换和权限校验
        let itemBoxList = Array.from(menuBox.querySelectorAll('.itemBox')),
            navBoxList = Array.from(navBox.querySelectorAll('a'));
        const change = (lx = 0) => {
            //  控制MENU的显示隐藏
            itemBoxList.forEach(item => {
                let text = item.getAttribute('text');
                if (lx === 0) {
                    item.style.display = text === '客户管理' ? 'block' : 'none';
                } else {
                    item.style.display = text === '客户管理' ? 'none' : 'block';
                }
            });
            // 控制NAV的选中状态
            navBoxList.forEach((item, index) => {
                if (lx === index) {
                    item.className = 'active';
                    return;
                }
                item.className = '';
            });
        };
        change(0);
        navBox.onclick = function (ev) {
            let target = ev.target,
                targetTag = target.tagName,
                targetText = target.innerText.trim();
            if (targetTag === 'A') {
                if (targetText === "客户管理") {
                    change(0);
                    return;
                }
                // 点击的是组织结构，我们还需要设置权限校验
                if (!/(userhandle|departhandle|jobhandle)/i.test(power)) {
                    alert('小主，您没有这一项的操作权限，请联系管理员~~');
                    return;
                }
                change(1);
            }
        };
    };
    $sub.on('INDEX', checkPower);

    // 进入首页的第一件事情：校验是否登录，没有登录，跳转到登录页面
    const initLogin = async function initLogin() {
        try {
            let {
                code
            } = await axios.get('/user/login');
            // 请求成功
            if (+code === 1) {
                // 没有登录
                alert('小主，您当前还没有登录，请先登录哦~~');
                location.href = 'login.html';
            }
            // 有登录：通知INDEX事件池中的方法执行
            $sub.emit('INDEX');
        } catch (err) {
            // 请求失败
            location.href = 'login.html';
        }
    };
    initLogin();
})();