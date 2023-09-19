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

    // 校验是否为修改操作:主要看问号传递的ID是否存在
    let userId = location.href.queryParams('id');

    // 数据绑定
    const bindDepartment = async () => {
        let departmentList = await common.queryDepartmentList(),
            str = ``;
        departmentList.forEach(({ id, name }) => {
            str += `<option value="${id}">
               ${name}
            </option>`;
        });
        userdepartment.innerHTML = str;
    };
    const bindJob = async () => {
        let jobList = await common.queryJobList(),
            str = ``;
        jobList.forEach(({ id, name }) => {
            str += `<option value="${id}">
               ${name}
            </option>`;
        });
        userjob.innerHTML = str;
    };
    const bindUserInfo = async () => {
        if (!userId) return;
        try {
            let { code, info } = await axios.get('/user/info', {
                params: {
                    userId
                }
            });
            if (+code !== 0) {
                alert('获取用户信息失败，请重新进入~');
                return;
            }
            // 把用户的信息绑定在表单中
            let { name, sex, email, phone, departmentId, jobId, desc } = info;
            username.value = name;
            +sex === 0 ? man.checked = true : woman.checked = true;
            useremail.value = email;
            userphone.value = phone;
            userdepartment.value = departmentId;
            userjob.value = jobId;
            userdesc.value = desc;
        } catch (_) { }
    };
    Promise.all([
        bindDepartment(),
        bindJob()
    ]).then(() => {
        bindUserInfo();
    });

    // 表单校验
    username.onblur = common.validateName.bind(null, username, spanusername);
    useremail.onblur = common.validateEmial.bind(null, useremail, spanuseremail);
    userphone.onblur = common.validatePhone.bind(null, userphone, spanuserphone);

    // 确认提交
    submit.onclick = async function () {
        // @1 表单校验
        if (
            !common.validateName(username, spanusername) ||
            !common.validateEmial(useremail, spanuseremail) ||
            !common.validatePhone(userphone, spanuserphone)
        ) return;

        // @2 新增或者修改
        let url = '/user/add',
            body = {
                name: username.value.trim(),
                sex: man.checked === true ? 0 : 1,
                email: useremail.value.trim(),
                phone: userphone.value.trim(),
                departmentId: userdepartment.value,
                jobId: userjob.value,
                desc: userdesc.value.trim()
            };
        if (userId) {
            url = '/user/update';
            body.userId = userId;
        }

        // @3 发送请求
        try {
            let { code } = await axios.post(url, body);
            if (+code === 0) {
                alert('恭喜您，操作成功！');
                location.href = 'userlist.html';
                return;
            }
            alert('当前操作失败，请稍后再试！');
        } catch (_) { }
    };

})();