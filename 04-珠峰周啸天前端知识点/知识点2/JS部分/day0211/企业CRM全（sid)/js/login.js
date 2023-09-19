(function () {
    let userName = document.querySelector('.userName'),
        userPass = document.querySelector('.userPass'),
        submit = document.querySelector('.submit');
    submit.onclick = async function () {
        let account = userName.value.trim(),
            password = userPass.value.trim();
        // 输入内容的合法校验
        if (account.length === 0 || password.length === 0) {
            alert('小主，账号和密码是必填项哦~~');
            return;
        }
        let regName = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{1,10})?$/,
            regPhone = /^1\d{10}$/,
            regEmail = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
            regPass = /^\w{6,16}$/;
        if (!regName.test(account) && !regPhone.test(account) && !regEmail.test(account)) {
            alert('小主，您输入的账号不合法哦~~');
            return;
        }
        if (!regPass.test(password)) {
            alert('小主，您输入的密码不合法哦~~');
            return;
        }

        // 密码需要MD5加密 
        password = md5(password);

        // 把数据提交给服务器
        let result = await axios.post('/user/login', {
            account,
            password
        });
        if (+result.code === 1) {
            alert('小主，账号和密码不匹配哦，请更正后再次尝试~~');
            return;
        }
        // 登录成功
        alert('小主，太棒了，登录成功~~');
        location.href = 'index.html';
    };
})();