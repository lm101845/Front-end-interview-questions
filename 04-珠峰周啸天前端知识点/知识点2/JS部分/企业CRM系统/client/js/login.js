(function () {
    let user = document.querySelector(".userName");//用户名
    let pass = document.querySelector(".userPass");//密码
    let submit = document.querySelector(".submit");//登录按钮

    //校验用户名
    function validateUser() {
        let userValue = user.value.trim();//获取用户名值，去掉前后空格
        if (userValue.length == 0) {
            alert("用户名不能为空！")
            return false;
        }
        let reg1 = /^(?:[\u4e00-\u9fa5·]{2,16})$/;//中文姓名
        let reg2 = /^(?:(?:\+|00)86)?1\d{10}$/; //手机号
        let reg3 = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;//邮箱
        if (reg1.test(userValue) || reg2.test(userValue) || reg3.test(userValue)) {
            return true;
        } else {
            alert("用户名格式不正确！");
            return false;
        }
    }

    //校验密码
    function validatePass() {
        let passValue = pass.value.trim();//获取密码值，去掉前后空格
        if (passValue.length == 0) {
            alert("密码不能为空！");
            return false;
        }
        // 6-16 字母 数字 下划线
        let reg = /^\w{6,16}$/g;
        if (reg.test(passValue)) {
            return true;
        } else {
            alert("密码格式不正确！");
            return false;
        }
    }

    //登录功能
    async function login() {
        if (validateUser() === false) {
            return;
        }
        if (validatePass() === false) {
            return;
        }
        let userValue = user.value.trim();//获取用户名值，去掉前后空格
        let passValue = pass.value.trim();//获取密码值，去掉前后空格
        try {
            let { code, info, token } = await axios.post("/user/login", {
                account: userValue,
                password: md5(passValue)
            })
            if (+code !== 0) {
                alert("登录失败,请重试!");
                user.value = "";
                pass.value = "";
                return;
            }
            //1.跳转到首页
            location.href = "./index.html";
            //2.存储token
            localStorage.setItem("abcToken", token);
            //localStorage.setItem("abcInfo",JSON.stringify(info));

        } catch (error) {
            console.log(error)
        }
    }
    submit.onclick = login;
})()