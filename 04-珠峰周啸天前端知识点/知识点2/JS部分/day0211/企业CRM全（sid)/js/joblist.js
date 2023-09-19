(function () {
    let tableBox = document.querySelector('.tableBox'),
        tbody = tableBox.querySelector('tbody');

    // 获取数据 & 数据绑定
    const binding = async function binding() {
        // 先看本地缓存中是否有数据，没有再从服务器获取
        let job = sessionStorage.getItem('job');
        if (!job) {
            let result = await axios.get('/job/list');
            if (+result.code !== 0) {
                job = [];
                return;
            }
            job = result.data;
            sessionStorage.setItem('job', JSON.stringify(job));
        } else {
            job = JSON.parse(job);
        }

        // 绑定数据
        let str = ``;
        job.forEach(item => {
            let {
                id,
                name,
                desc,
                power
            } = item;
            // 把权限字段替换成为中文
            power = power.replace('userhandle', '员工操作权')
                .replace('departhandle', '部门操作权')
                .replace('jobhandle', '职务操作权')
                .replace('customerall', '全部客户操作权')
                .replace(/\|/g, '、');
            str += `<tr>
                <td class="w8">${id}</td>
                <td class="w10">${name}</td>
                <td class="w20">${desc}</td>
                <td class="w50">${power}</td>
                <td class="w12" data-id="${id}">
                    <a href="jobadd.html?jobId=${id}">编辑</a>
                    <a href="javascript:;">删除</a>
                </td>
            </tr>`;
        });
        tbody.innerHTML = str;
    };

    // 基于事件委托实现删除
    tbody.onclick = async function (ev) {
        let target = ev.target,
            targetTag = target.tagName,
            jobId = target.parentNode.getAttribute('data-id');
        if (targetTag === 'A' && target.innerHTML.trim() === "删除") {
            let flag = confirm(`小主，您确定要删除编号为 ${jobId} 的职务吗？`);
            if (!flag) return;
            // 发送请求给服务器实现删除
            let {
                code
            } = await axios.get('/job/delete', {
                params: {
                    jobId
                }
            });
            if (+code !== 0) {
                alert('小主，很遗憾删除失败了~~');
                return;
            }
            alert('小主，恭喜您删除成功了~~');
            sessionStorage.removeItem('job');
            binding();
        }
    };

    binding();
})();