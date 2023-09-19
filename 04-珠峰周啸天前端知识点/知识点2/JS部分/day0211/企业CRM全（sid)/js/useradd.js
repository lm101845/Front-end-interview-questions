(function () {
    let username = document.querySelector('.username'),
        spanusername = document.querySelector('.spanusername'),
        man = document.querySelector('#man'),
        woman = document.querySelector('#woman'),
        useremail = document.querySelector('.useremail'),
        spanuseremail = document.querySelector('.spanuseremail'),
        userphone = document.querySelector('.userphone'),
        spanuserphone = document.querySelector('.spanuserphone'),
        userdepartment = document.querySelector('.userdepartment'),
        userjob = document.querySelector('.userjob'),
        userdesc = document.querySelector('.userdesc'),
        submit = document.querySelector('.submit');

    // 获取传递的userId：有传递就是修改某个员工信息，没有传递就是新增员工
    let userId;
    let obj = location.href.queryURLParams();
    userId = obj.userId;

    // 如果是修改的话，我们需要获取当前用户的信息，放在指定的文本框中
    const queryUserInfo = async function queryUserInfo() {
        let result = await axios.get('/user/info', {
            params: {
                userId
            }
        });
        if (+result.code !== 0) {
            alert('小主，当前用户不存在，请查证~~');
            submit.style.display = 'none';
            return;
        }
        submit.style.display = 'block';
        let {
            name,
            email,
            phone,
            sex,
            departmentId,
            jobId,
            desc
        } = result.data;
        username.value = name;
        useremail.value = email;
        userphone.value = phone;
        userdepartment.value = departmentId;
        userjob.value = jobId;
        userdesc.value = desc;
        (+sex === 0) ? man.checked = true: woman.checked = true;
    };

    // 绑定部门信息
    const bindDepartList = async function bindDepartList() {
        // 从本地获取服务器端获取部门列表 
        let department = sessionStorage.getItem('department');
        if (department) {
            department = JSON.parse(department);
        } else {
            let result = await axios.get('/department/list');
            if (+result.code !== 0) return;
            department = result.data;
            sessionStorage.setItem('department', JSON.stringify(department));
        }

        // 绑定数据
        let str = ``;
        department.forEach(item => {
            let {
                id,
                name
            } = item;
            str += `<option value="${id}">
                ${name}
            </option>`;
        });
        userdepartment.innerHTML = str;
    };

    // 绑定职务信息
    const bindJobList = async function bindJobList() {
        // 从本地获取服务器端获取职务信息
        let job = sessionStorage.getItem('job');
        if (job) {
            job = JSON.parse(job);
        } else {
            let result = await axios.get('/job/list');
            if (+result.code !== 0) return;
            job = result.data;
            sessionStorage.setItem('job', JSON.stringify(job));
        }

        // 实现数据绑定
        let str = ``;
        job.forEach(item => {
            let {
                id,
                name
            } = item;
            str += `<option value="${id}">
                ${name}
            </option>`;
        });
        userjob.innerHTML = str;
    };

    // 我们要保证部门和职务信息都绑定完了，再去获取修改的用户信息...
    Promise.all([bindDepartList(), bindJobList()]).then(() => {
        if (userId) {
            queryUserInfo();
        }
    });

    /* 下面是手动操作触发 */
    // 校验用户名
    const checkUserName = function checkUserName() {
        let name = username.value.trim();
        if (name.length === 0) {
            spanusername.innerHTML = '小主，用户名为必填项哦~~';
            return false;
        }
        if (!/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{1,10})?$/.test(name)) {
            spanusername.innerHTML = '小主，用户名必须是真实姓名哦~~';
            return false;
        }
        spanusername.innerHTML = '';
        return true;
    };
    username.onblur = checkUserName;

    // 校验邮箱
    const checkUserEmail = function checkUserEmail() {
        let email = useremail.value.trim();
        if (email.length === 0) {
            spanuseremail.innerHTML = '小主，邮箱为必填项哦~~';
            return false;
        }
        if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(email)) {
            spanuseremail.innerHTML = '小主，邮箱输入的不对哦~~';
            return false;
        }
        spanuseremail.innerHTML = '';
        return true;
    };
    useremail.onblur = checkUserEmail;

    // 校验手机号
    const checkUserPhone = function checkUserPhone() {
        let phone = userphone.value.trim();
        if (phone.length === 0) {
            spanuserphone.innerHTML = '小主，手机号为必填项哦~~';
            return false;
        }
        if (!/^1\d{10}$/.test(phone)) {
            spanuserphone.innerHTML = '小主，手机号输入的不对哦~~';
            return false;
        }
        spanuserphone.innerHTML = '';
        return true;
    };
    userphone.onblur = checkUserPhone;

    // 提交信息
    submit.onclick = async function () {
        // 先表单校验
        if (!checkUserName() || !checkUserEmail() || !checkUserPhone()) return;
        // 获取用户输入的信息
        let name = username.value.trim(),
            sex = man.checked ? 0 : 1,
            email = useremail.value.trim(),
            phone = userphone.value.trim(),
            departmentId = userdepartment.value,
            jobId = userjob.value,
            desc = userdesc.value.trim();

        // 把信息提交给服务器:区分是新增还是修改
        let url = '/user/add',
            body = {
                name,
                sex,
                email,
                phone,
                departmentId,
                jobId,
                desc
            };
        if (userId) {
            // 修改
            url = '/user/update';
            body.userId = userId;
        }
        let result = await axios.post(url, body);
        if (+result.code !== 0) {
            alert('小主，当前操作失败了，请您稍后再试~~');
            return;
        }
        alert('小主，恭喜您，当前操作成功了~~');
        location.href = 'userlist.html';
    };
})();