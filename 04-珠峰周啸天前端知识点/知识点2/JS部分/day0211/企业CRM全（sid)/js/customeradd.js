(function () {
    let username = document.querySelector('.username'),
        man = document.querySelector('#man'),
        woman = document.querySelector('#woman'),
        useremail = document.querySelector('.useremail'),
        userphone = document.querySelector('.userphone'),
        userqq = document.querySelector('.userqq'),
        userweixin = document.querySelector('.userweixin'),
        usertype = document.querySelector('.usertype'),
        useraddress = document.querySelector('.useraddress'),
        submit = document.querySelector('.submit');

    // 获取传递的customerId：新增是不传递的 & 其余的参数值
    let {
        customerId,
        lx = 'my',
        page = 1,
        type: passType = '',
        search = ''
    } = location.href.queryURLParams();

    // 如果是修改，我们需要先获取客户信息，然后放置在文本框中
    const queryBaseInfo = async function queryBaseInfo() {
        let {
            code,
            data
        } = await axios.get('/customer/info', {
            params: {
                customerId
            }
        });
        if (+code !== 0) {
            alert('小主，当前客户不存在~~');
            return;
        }
        // 获取信息，赋值到指定的文本框中
        let {
            name,
            sex,
            email,
            phone,
            QQ,
            weixin,
            type,
            address
        } = data;
        username.value = name;
        (+sex === 0) ? man.checked = true: woman.checked = true;
        useremail.value = email;
        userphone.value = phone;
        userqq.value = QQ;
        userweixin.value = weixin;
        usertype.value = type;
        useraddress.value = address;
    };
    if (customerId) queryBaseInfo();

    // 「待处理」各种表单校验
    // ... 用户名、邮箱、电话、QQ、微信

    // 点击提交按钮「新增 或者 修改」
    submit.onclick = async function () {
        // 「待处理」表单格式校验...
        let name = username.value.trim(),
            sex = man.checked ? 0 : 1,
            email = useremail.value.trim(),
            phone = userphone.value.trim(),
            QQ = userqq.value.trim(),
            weixin = userweixin.value.trim(),
            type = usertype.value.trim(),
            address = useraddress.value.trim();

        // 验证是新增还是修改
        let url = '/customer/add',
            body = {
                name,
                sex,
                email,
                phone,
                weixin,
                QQ,
                type,
                address
            };
        if (customerId) {
            url = '/customer/update';
            body.customerId = customerId;
        }

        // 向服务器发送请求
        let {
            code
        } = await axios.post(url, body);
        if (+code !== 0) {
            alert('小主，很遗憾，当前操作失败了~~');
            return;
        }
        alert('小主，恭喜您，当前操作成功了~~');

        // 区分新增和修改的跳转:新增跳转到我的客户 & 修改需要跳转到原定位置(信息回传)
        if (!customerId) {
            location.href = 'customerlist.html';
            return;
        }
        location.href = `customerlist.html?lx=${lx}&page=${page}&search=${search}&type=${passType}`;
    };
})();