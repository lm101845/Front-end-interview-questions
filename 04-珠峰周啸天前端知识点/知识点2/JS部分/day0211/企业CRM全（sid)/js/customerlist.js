(function () {
    let selectBox = document.querySelector('.selectBox'),
        searchInp = document.querySelector('.searchInp'),
        tableBox = document.querySelector('.tableBox'),
        tbody = tableBox.querySelector('tbody'),
        pageBox = document.querySelector('.pageBox');

    // 先获取传递的lx值，以此区分是我的客户还是全部客户
    // 如果是从编辑页面回来的，我们还需要获取回传的信息
    let limit = 10;
    let {
        lx = 'my',
            page = 1,
            type = '',
            search = ''
    } = location.href.queryURLParams();
    page = +page;
    selectBox.value = decodeURI(type); //URL问号参数传递中文，自己会encodeURI编译，我们需要decodeURI解编译
    searchInp.value = search;

    // 获取数据 & 数据绑定
    const binding = async function binding() {
        // 发送数据请求
        let result = await axios.get('/customer/list', {
            params: {
                lx,
                limit,
                page,
                type: selectBox.value,
                search: searchInp.value.trim()
            }
        });
        let data = [],
            total = 0,
            totalPage = 0;
        if (+result.code === 0) {
            // 请求成功
            data = result.data;
            total = +result.total;
            totalPage = +result.totalPage;
        }

        // 绑定列表数据
        let str = ``;
        data.forEach(item => {
            let {
                id,
                name,
                sex,
                email,
                phone,
                QQ,
                weixin,
                type,
                address,
                userName
            } = item;
            str += `<tr>
                <td class="w8">${name}</td>
                <td class="w5">${(+sex===0)?'男':'女'}</td>
                <td class="w10">${email}</td>
                <td class="w10">${phone}</td>
                <td class="w10">${weixin}</td>
                <td class="w10">${QQ}</td>
                <td class="w5">${type}</td>
                <td class="w8">${userName}</td>
                <td class="w20">${address}</td>
                <td class="w14">
                    <a href="customeradd.html?customerId=${id}&lx=${lx}&page=${page}&type=${selectBox.value}&search=${searchInp.value.trim()}">编辑</a>
                    <a href="javascript:;" data-id="${id}">删除</a>
                    <a href="visit.html?customerId=${id}">回访记录</a>
                </td>
            </tr>`;
        });
        tbody.innerHTML = str;

        // 绑定分页的数据
        if (totalPage > 1) {
            str = ``;
            if (page > 1) str += `<a href="javascript:;">上一页</a>`;
            str += `<ul class="pageNum">`;
            new Array(totalPage).fill(null).forEach((_, index) => {
                let n = index + 1;
                str += `<li class="${n===page?'active':''}">
                    ${n}
                </li>`;
            });
            str += `</ul>`;
            if (page < totalPage) str += `<a href="javascript:;">下一页</a>`;
            pageBox.innerHTML = str;
        } else {
            pageBox.innerHTML = '';
        }
    };

    // 第一次渲染页面
    binding();

    // 下拉框内容改变 & 模糊搜索按下Enter键 {每一次搜索，都从第一页开始渲染}
    selectBox.onchange = function () {
        page = 1;
        binding();
    };
    searchInp.onkeydown = function (ev) {
        if (ev.keyCode === 13) {
            page = 1;
            binding();
        }
    };

    // 分页点击操作
    pageBox.onclick = function (ev) {
        let target = ev.target,
            targetTag = target.tagName,
            targetText = target.innerHTML;
        if (targetTag === 'A') {
            // 上一页
            if (targetText === '上一页') {
                page--;
            }
            // 下一页
            if (targetText === '下一页') {
                page++;
            }
            binding();
            return;
        }
        // 点击的页码
        if (targetTag === 'LI') {
            page = +targetText;
            binding();
        }
    };

    // 删除操作
    tbody.onclick = async function (ev) {
        let target = ev.target,
            targetTag = target.tagName,
            targetText = target.innerHTML;
        // 删除客户信息
        if (targetTag === 'A' && targetText === '删除') {
            let customerId = target.getAttribute('data-id'),
                flag = confirm(`小主，您确定要删除编号为 ${customerId} 的客户吗？`);
            if (!flag) return;
            let {
                code
            } = await axios.get('/customer/delete', {
                params: {
                    customerId
                }
            });
            if (+code !== 0) {
                alert('小主，很遗憾，当前删除失败，请稍后再试~~');
                return;
            }
            alert('小主，恭喜您，当前删除成功了~~');
            // 优化处理：如果当前这一页，这条数据删除完，正好一条数据都没有了，我们则直接渲染上一页的数据即可「前提：当前不是第一页」
            if (tbody.children.length <= 1 && page > 1) {
                page--;
            }
            binding();
        }
    };
})();