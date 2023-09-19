(function () {
    let filterBox = document.querySelector('.filterBox'),
        deleteAll = filterBox.querySelector('.deleteAll'),
        selectBox = filterBox.querySelector('.selectBox'),
        searchInp = filterBox.querySelector('.searchInp'),
        tableBox = document.querySelector('.tableBox'),
        checkAll = tableBox.querySelector('#checkAll'),
        tbody = tableBox.querySelector('tbody');
    let userListData = [];

    // 根据获取的数据渲染列表
    const render = function render() {
        let str = ``;
        userListData.forEach(item => {
            let {
                id,
                name,
                sex,
                email,
                phone,
                department,
                job,
                desc,
                selected //自己新增的字段，控制列表中每一项的复选框选中状态「data-id自定义属性记录每一项数据的ID」
            } = item;
            str += `<tr>
                <td class="w3">
                    ${+id===1?``:`<input type="checkbox" data-id="${id}" ${selected?'checked':''}>`}
                </td>
                <td class="w10">${name}</td>
                <td class="w5">${+sex===0?'男':'女'}</td>
                <td class="w10">${department}</td>
                <td class="w10">${job}</td>
                <td class="w15">${email}</td>
                <td class="w15">${phone}</td>
                <td class="w20">${desc}</td>
                <td class="w12" data-id="${id}">
                    <a href="useradd.html?userId=${id}">编辑</a>
                    ${+id===1?``:`<a href="javascript:;">删除</a>`}
                    <a href="javascript:;">重置密码</a>
                </td>
            </tr>`;
        });
        tbody.innerHTML = str;
    };

    // 从服务器获取员工的数据
    const queryUserList = async function queryUserList() {
        // 获取下拉框选中的部门 & 搜索框输入的关键词
        let departmentId = selectBox.value,
            search = searchInp.value.trim();

        try {
            // 向服务器发送请求
            let result = await axios.get('/user/list', {
                params: {
                    departmentId,
                    search
                }
            });
            if (+result.code !== 0) {
                // 没有获取想要的数据
                userListData = [];
                render();
                return;
            }
            // 获取数据后 && 给数据中的每一项设置selected属性,默认值false
            userListData = result.data;
            userListData = userListData.map(item => {
                item.selected = false;
                return item;
            });
            render();
        } catch (err) {
            // 请求失败
            userListData = [];
            render();
        }

        // 每一次重新获取数，因为要重新的渲染，把checkAll选中态清空
        checkAll.checked = false;
    };

    // 获取所有部门信息，并且展示在下拉框中 && 下拉框选中部门切换，控制表格数据重新获取 && 对于不经常更新的数据最好做缓存处理
    const queryDepartList = async function queryDepartList() {
        // 获取数据：先看本地缓存中是否有，如果缓存中有，则使用缓存的数据，减少ajax请求，缓存中没有再从服务器获取最新的数据，获取数据后记得缓存在本地...
        let data = sessionStorage.getItem('department');
        if (data) {
            data = JSON.parse(data);
        } else {
            let result = await axios.get('/department/list');
            if (+result.code !== 0) return;
            data = result.data;
            sessionStorage.setItem('department', JSON.stringify(data));
        }
        // 数据绑定
        let str = ``;
        data.forEach(item => {
            let {
                id,
                name
            } = item;
            str += `<option value="${id}">
                ${name}
            </option>`;
        });
        selectBox.innerHTML += str;
    };
    queryDepartList();
    selectBox.onchange = queryUserList;

    // 按照搜索框输入的内容模糊搜索
    searchInp.onkeydown = function (ev) {
        if (ev.keyCode === 13) {
            // 按下的是Enter键，我们重新按照搜索的关键词获取数据
            queryUserList();
        }
    };

    // 全选和非全选功能的实现
    checkAll.onclick = function () {
        userListData = userListData.map(item => {
            item.selected = (+item.id === 1) ? false : checkAll.checked;
            return item;
        });
        render();
    };

    // 事件委托
    tbody.onclick = async function (ev) {
        let target = ev.target,
            targetTag = target.tagName,
            targetText = target.innerHTML.trim(),
            targetParent = target.parentNode,
            userId = targetParent.getAttribute('data-id');

        // 点击列表中每一个复选框控制当前自己这一项和checkAll的状态
        if (targetTag === 'INPUT') {
            // 点击每一项的复选框，让自身状态变为TRUR/FALSE
            let id = +target.getAttribute('data-id'),
                flag = false;
            userListData = userListData.map(item => {
                if (+id === +item.id) {
                    // 点击是这个
                    item.selected = target.checked;
                }
                return item;
            });
            // 控制checkAll
            flag = userListData.every(item => {
                if (+item.id === 1) return true;
                return item.selected === true;
            });
            checkAll.checked = flag;
            render();
            return;
        }

        // 重置密码
        if (targetTag === 'A' && targetText === '重置密码') {
            let flag = confirm(`您确定要重置编号为 ${userId} 这个员工的密码吗？`);
            if (!flag) return;
            let result = await axios.post('/user/resetpassword', {
                userId
            });
            if (+result.code !== 0) {
                alert('小主，当前重置密码失败，请您稍后再试~~');
                return;
            }
            alert('小主，恭喜您，当前重置密码成功了~~');
            return;
        }

        // 删除员工
        if (targetTag === 'A' && targetText === '删除') {
            let flag = confirm(`您确定要删除编号为 ${userId} 的这个员工吗？`);
            if (!flag) return;
            let result = await axios.get('/user/delete', {
                params: {
                    userId
                }
            });
            if (+result.code !== 0) {
                alert('小主，当前删除操作失败了，请稍后再试~~');
                return;
            }
            alert('小主，恭喜您，当前删除操作成功了~~');
            // 刷新列表数据 @1从服务器获取最新数据渲染  @2让tbody直接移除这个tr(数据中也需要移除这一项)
            // queryUserList();
            tbody.removeChild(target.parentNode.parentNode);
            userListData = userListData.filter(item => +item.id !== +userId);
        }
    };

    //批量删除
    deleteAll.onclick = function () {
        // 获取所有选中的员工ID
        let arr = [];
        userListData.forEach(item => {
            if (item.selected) {
                arr.push(item.id);
            }
        });

        // 必须有选中项
        if (arr.length === 0) {
            alert('小主，您至少选择一个要删除的信息哦~~');
            return;
        }
        // 给予提示
        let flag = confirm(`小主，您当前选中了 ${arr.length} 个用户，您确定都要删除他们吗？`);
        if (!flag) return;

        // 给予递归的方式一个个的删除
        const next = async () => {
            // 都删除完毕:重新获取服务器最新的数据进行渲染
            if (arr.length === 0) {
                alert('小主，恭喜您，所有选中的用户都删除完毕了~~');
                queryUserList();
                return;
            }
            let userId = arr.shift();
            let result = await axios.get('/user/delete', {
                params: {
                    userId
                }
            });
            if (+result.code !== 0) {
                alert(`小主，编号为 ${userId} 的用户删除失败，批量删除操作被终止，还剩下 ${arr.length+1} 项没删除!`);
                return;
            }
            next();
        };
        next();
    };

    // 开始加载页面获取所有用户信息
    queryUserList();
})();