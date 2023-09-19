(function () {
    let jobname = document.querySelector('.jobname'),
        spanjobname = document.querySelector('.spanjobname'),
        jobdesc = document.querySelector('.jobdesc'),
        spanjobdesc = document.querySelector('.spanjobdesc'),
        powerList = Array.from(document.querySelectorAll('input[name="job"]')),
        submit = document.querySelector('.submit');

    // 传递jobId是修改，否则是新增
    let obj = location.href.queryURLParams(),
        jobId = obj.jobId;

    // 如果是修改，需要先获取部门信息放在指定的文本框中
    const queryBaseInfo = async function queryBaseInfo() {
        let {
            code,
            data
        } = await axios.get('/job/info', {
            params: {
                jobId
            }
        });
        if (+code !== 0) {
            alert('当前编辑的职务不存在哦!!');
            submit.style.display = 'none';
            return;
        }
        submit.style.display = 'block';

        // 把信息放在指定的文本框中
        let {
            name,
            desc,
            power
        } = data;
        jobname.value = name;
        jobdesc.value = desc;
        // 根据权限控制哪些框选中
        power = power.split('|');
        power.forEach(item => {
            let inp = document.querySelector(`#${item}`);
            if (inp) {
                inp.checked = true;
            }
        });
    };
    if (jobId) queryBaseInfo();

    // 表单校验
    const checkName = function checkName() {
        let name = jobname.value.trim();
        if (name.length === 0) {
            spanjobname.innerHTML = '职务名称不能为空哦~~';
            return false;
        }
        spanjobname.innerHTML = '';
        return true;
    };
    jobname.onblur = checkName;

    const checkDesc = function checkDesc() {
        let desc = jobdesc.value.trim();
        if (desc.length === 0) {
            spanjobdesc.innerHTML = '部门描述不能为空哦~~';
            return false;
        }
        spanjobdesc.innerHTML = '';
        return true;
    };
    jobdesc.onblur = checkDesc;

    // 点击提交按钮实现新增或者修改
    submit.onclick = async function () {
        if (!checkName() || !checkDesc()) return;
        let name = jobname.value.trim(),
            desc = jobdesc.value.trim(),
            power = [];
        powerList.forEach(item => {
            if (item.checked) {
                power.push(item.value);
            }
        });
        power = power.join('|');

        let url = '/job/add',
            body = {
                name,
                desc,
                power
            };
        if (jobId) {
            url = '/job/update';
            body.jobId = jobId;
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
        sessionStorage.removeItem('job');
        location.href = 'joblist.html';
    };
})();