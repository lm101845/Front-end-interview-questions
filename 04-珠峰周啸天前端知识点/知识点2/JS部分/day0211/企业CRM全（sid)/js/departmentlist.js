(function () {
    let tableBox = document.querySelector('.tableBox'),
        tbody = tableBox.querySelector('tbody');

    // 获取数据 & 数据绑定
    const binding = async function binding() {
        // 先看本地缓存中是否有数据，没有再从服务器获取
        let department = sessionStorage.getItem('department');
        if (!department) {
            let result = await axios.get('/department/list');
            if (+result.code !== 0) {
                department = [];
                return;
            }
            department = result.data;
            sessionStorage.setItem('department', JSON.stringify(department));
        } else {
            department = JSON.parse(department);
        }

        // 绑定数据
        let str = ``;
        department.forEach(item => {
            let {
                id,
                name,
                desc
            } = item;
            str += `<tr>
                <td class="w10">${id}</td>
                <td class="w20">${name}</td>
                <td class="w40">${desc}</td>
                <td class="w20" data-id="${id}">
                    <a href="departmentadd.html?departmentId=${id}">编辑</a>
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
            departmentId = target.parentNode.getAttribute('data-id');
        if (targetTag === 'A' && target.innerHTML.trim() === "删除") {
            let flag = confirm(`小主，您确定要删除编号为 ${departmentId} 的部门吗？`);
            if (!flag) return;

            // 发送请求给服务器实现删除
            let {
                code
            } = await axios.get('/department/delete', {
                params: {
                    departmentId
                }
            });
            if (+code !== 0) {
                alert('小主，很遗憾删除失败了~~');
                return;
            }
            alert('小主，恭喜您删除成功了~~');
            // 因为列表展示的数据可能是从缓存中获取的，所以当我们把服务器的数据更新后，我们需要先把本地缓存清除，然后在重新渲染数据；这样它会从服务器重新拉去最新的数据进行处理！！
            sessionStorage.removeItem('department');
            binding();
        }
    };

    binding();
})();