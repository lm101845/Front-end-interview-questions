let zTree = document.querySelector('#zTree');

// 动态绑定树级结构菜单
const render = function render(data) {
    // 基于递归，创建每一级的LI
    const next = (arr) => {
        let str = ``;
        arr.forEach(item => {
            let { name, open, children } = item;
            str += `<li>
                <a href="javascript:;" class="title">${name}</a>
                ${Array.isArray(children) ? `
                    <em class="icon ${open ? 'open' : ''}"></em>
                    <ul class="level" style="display: ${open ? 'block' : 'none'};">
                        ${next(children)}
                    </ul>
                `: ``}
            </li>`;
        });
        return str;
    };
    zTree.innerHTML = next(data);
};

// 点击“+/-”实现菜单的展开和隐藏
const handle = function handle() {
    zTree.addEventListener('click', function (ev) {
        let target = ev.target,
            emClassList,
            sibling;
        if (target.tagName !== "EM") return;
        // 点击的是加减按钮
        emClassList = target.classList;
        sibling = target.nextElementSibling;
        if (emClassList.contains('open')) {
            // 目前有open样式类，说明当前是展开的，我们让其收起！
            emClassList.remove('open');
            sibling.style.display = 'none';
            return;
        }
        // 当前是隐藏的，我们让其展开！
        emClassList.add('open');
        sibling.style.display = 'block';
    });
};

// 基于Promise管理异步数据请求
const query = function query() {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', './data.json');
        xhr.onreadystatechange = () => {
            let { readyState, status, responseText } = xhr;
            if (readyState === 4 && status === 200) {
                let data = JSON.parse(responseText);
                resolve(data);
            }
        };
        xhr.send();
    });
};
query().then(data => {
    console.log(data);
    // 数据请求成功
    render(data);
    handle();
});