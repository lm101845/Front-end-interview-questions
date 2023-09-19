(function () {
    let departname = document.querySelector('.departname'),
        spandepartname = document.querySelector('.spandepartname'),
        departdesc = document.querySelector('.departdesc'),
        spandepartdesc = document.querySelector('.spandepartdesc'),
        submit = document.querySelector('.submit');

    // 传递departmentId是修改，否则是新增
    let obj = location.href.queryURLParams(),
        departmentId = obj.departmentId;

    // 如果是修改，需要先获取部门信息放在指定的文本框中
    const queryBaseInfo = async function queryBaseInfo() {
        let {
            code,
            data
        } = await axios.get('/department/info', {
            params: {
                departmentId
            }
        });
        if (+code !== 0) {
            alert('当前编辑的部门不存在哦!!');
            submit.style.display = 'none';
            return;
        }
        submit.style.display = 'block';

        // 把信息放在指定的文本框中
        let {
            name,
            desc
        } = data;
        departname.value = name;
        departdesc.value = desc;
    };
    if (departmentId) queryBaseInfo();

    // 表单校验
    const checkName = function checkName() {
        let name = departname.value.trim();
        if (name.length === 0) {
            spandepartname.innerHTML = '部门名称不能为空哦~~';
            return false;
        }
        spandepartname.innerHTML = '';
        return true;
    };
    departname.onblur = checkName;

    const checkDesc = function checkDesc() {
        let desc = departdesc.value.trim();
        if (desc.length === 0) {
            spandepartdesc.innerHTML = '部门描述不能为空哦~~';
            return false;
        }
        spandepartdesc.innerHTML = '';
        return true;
    };
    departdesc.onblur = checkDesc;

    // 点击提交按钮实现新增或者修改
    submit.onclick = async function () {
        if (!checkName() || !checkDesc()) return;
        let name = departname.value.trim(),
            desc = departdesc.value.trim();
        let url = '/department/add',
            body = {
                name,
                desc
            };
        if (departmentId) {
            url = '/department/update';
            body.departmentId = departmentId;
        }
        let {
            code
        } = await axios.post(url, body);
        if (+code !== 0) {
            alert('小主，当前操作失败了，请稍后再试~~');
            return;
        }
        alert('小主，恭喜您，当前操作成功了~~');
        // 还是不要忘记清除本地缓存哦
        sessionStorage.removeItem('department');
        location.href = 'departmentlist.html';
    };
})();