(function () {
    let filterBox = document.querySelector('.filterBox'),
        deleteAll = filterBox.querySelector('.deleteAll'),
        selectBox = filterBox.querySelector('.selectBox'),
        searchInp = filterBox.querySelector('.searchInp'),
        checkAll = document.querySelector('#checkAll'),
        tbody = document.querySelector('tbody'),
        checkboxList = [];
    // 复用性较强的操作
    const queryCheckBoxList = () => {
        checkboxList = Array.from(tbody.querySelectorAll("input[type='checkbox']"));
    };
    const deleteApi = (id) => {
        return axios.get('/user/delete', {
            params: {
                userId: id
            }
        });
    };

    // 部门列表的绑定
    const bindDepartment = async function bindDepartment() {
        let departmentList = await common.queryDepartmentList();
        let frag = document.createDocumentFragment();
        departmentList.forEach(item => {
            let { id, name } = item,
                option = document.createElement('option');
            option.value = id;
            option.innerHTML = name;
            frag.appendChild(option);
        });
        selectBox.appendChild(frag);
        frag = null;
    };
    bindDepartment();

    // 员工列表的绑定
    const bindUserList = async function bindUserList() {
        // @1 从服务器获取数据
        let userList = [];
        try {
            let { code, data } = await axios.get('/user/list', {
                params: {
                    departmentId: selectBox.value,
                    search: searchInp.value.trim()
                }
            });
            if (+code === 0) {
                userList = data;
            }
        } catch (_) { }

        // @2 根据数据做绑定
        let str = ``;
        userList.forEach(item => {
            let { id, name, sex, email, phone, department, job, desc } = item;
            if (+id === 1) {
                // 特殊处理:最高管理员账号是不允许被删除的 && 只有本人登录才可以修改
                str += `<tr>
                    <td class="w3"></td>
                    <td class="w10">${name}</td>
                    <td class="w5">${+sex === 0 ? '男' : '女'}</td>
                    <td class="w10">${department}</td>
                    <td class="w10">${job}</td>
                    <td class="w15">${email}</td>
                    <td class="w15">${phone}</td>
                    <td class="w20">${desc}</td>
                    <td class="w12" userId="${id}">
                        ${+parent.loginInfoId === 1 ? `
                            <a href="useradd.html?id=${id}">编辑</a>
                            <a href="javascript:;">重置密码</a>
                        `: ``}
                    </td>
                </tr>`;
                return;
            }
            // 其余的正常绑定即可
            str += `<tr>
                <td class="w3"><input type="checkbox" userId="${id}"></td>
                <td class="w10">${name}</td>
                <td class="w5">${+sex === 0 ? '男' : '女'}</td>
                <td class="w10">${department}</td>
                <td class="w10">${job}</td>
                <td class="w15">${email}</td>
                <td class="w15">${phone}</td>
                <td class="w20">${desc}</td>
                <td class="w12" userId="${id}">
                    <a href="useradd.html?id=${id}">编辑</a>
                    <a href="javascript:;">删除</a>
                    <a href="javascript:;">重置密码</a>
                </td>
            </tr>`;
        });
        tbody.innerHTML = str;

        // @3 获取需要的信息
        checkAll.checked = false;
        queryCheckBoxList();
    };
    bindUserList();

    // 筛选的操作
    selectBox.onchange = bindUserList;
    searchInp.onkeydown = function (ev) {
        if (ev.keyCode === 13) {
            // 按下Enter键
            bindUserList();
        }
    };

    // 基于事件委托实现TBODY中的事件处理
    const removeHandle = async (id, target) => {
        try {
            let { code } = await deleteApi(id);
            if (+code === 0) {
                alert('恭喜您，删除成功~');
                tbody.removeChild(target.parentNode.parentNode);
                queryCheckBoxList();
                return;
            }
            alert('删除失败，请稍后再试！');
        } catch (_) { }
    };
    const resetHandle = async (id) => {
        try {
            let { code } = await axios.post('/user/resetpassword', { userId: id });
            if (+code === 0) {
                alert('恭喜您，重置密码成功~');
                return;
            }
            alert('重置密码失败，请稍后再试！');
        } catch (_) { }
    };
    tbody.onclick = function (ev) {
        let target = ev.target,
            targetTag = target.tagName,
            text = target.innerHTML;
        // 删除按钮 && 重置密码按钮
        if (targetTag === 'A' && text !== "编辑") {
            let userId = +target.parentNode.getAttribute('userId'),
                confirmText = text === '删除' ? '您确定要删除此项吗?' : '您确定要为此项重置密码吗?';
            let flag = confirm(confirmText);
            if (flag) {
                // 点击确定
                text === "删除" ? removeHandle(userId, target) : resetHandle(userId);
            }
            return;
        }

        // 复选框
        if (targetTag === "INPUT") {
            checkBoxHandle();
            return;
        }
    };

    // 全选和全不选的操作
    const checkBoxHandle = () => {
        let flag = true;
        checkboxList.forEach(item => {
            if (!item.checked) {
                flag = false;
            }
        });
        checkAll.checked = flag;
    };
    checkAll.onclick = function () {
        let checked = this.checked;
        checkboxList.forEach(item => {
            item.checked = checked;
        });
    };

    // 批量删除
    deleteAll.onclick = function () {
        // 收集选中项的ID
        let ids = [];
        checkboxList.forEach(item => {
            if (item.checked) {
                ids.push(
                    +item.getAttribute('userId')
                );
            }
        });

        // 提示
        let len = ids.length;
        if (len === 0) {
            alert('请至少选中一项进行删除！');
            return;
        }
        let flag = confirm(`您确定要删除这${len}项内容吗？`),
            num = 0;
        if (!flag) return;

        // 基于递归实现批量删除
        const next = async () => {
            if (num >= len) {
                // 全部删除完毕
                alert(`恭喜您，已经成功删除${len}项~`);
                queryCheckBoxList();
                return;
            }
            let id = ids[num];
            try {
                let { code } = await deleteApi(id);
                if (+code === 0) {
                    // 这一项删除成功
                    num++;
                    next();
                    // 移除这一行信息
                    let selectItem = tbody.querySelector(`input[userId="${id}"]`);
                    if (selectItem) tbody.removeChild(selectItem.parentNode.parentNode);
                    return;
                }
            } catch (_) { }
            // 这一项删除失败
            alert(`删除过程中遇到失败，一共要删除${len}项，目前删除了${num}项！`);
            queryCheckBoxList();
        };
        next();
    };

})();