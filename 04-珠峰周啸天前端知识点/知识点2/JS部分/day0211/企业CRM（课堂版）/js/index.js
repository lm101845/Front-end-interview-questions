(function () {
    let baseBoxSpan = document.querySelector(".baseBox span");//姓名
    let headerBox = document.querySelector(".headerBox");//安全退出 切换
    let menuBox = document.querySelector(".menuBox");//左侧列表
    let navBoxa = Array.from(document.querySelectorAll(".navBox a"));//tab标题
    let menuBoxItem = null;
    //1.进入首页，先验证一下是否登录
    async function isLogin() {
        let { code, info } = await axios.get("/user/login")
        if (+code !== 0) {//直接进入，不可能有token
            alert("未登录，请先登录");
            location.href = "./login.html";
        } else {
            //获取数据渲染页面
            //1.显示姓名
            baseBoxSpan.innerHTML = "您好：" + info.name;
            //2.先渲染左侧列表----power--渲染完后，才能切换
            render(info.power);
            //3.安全退出---事件委托---登录成功后
            //4.切换----事件委托---登录成功后
            handle(info.power);
        }
    }
    isLogin()

    function render(power) {
        let str = "";
        if (power.includes("userhandle")) {
            str += `<div class="itemBox" text="员工管理">
                <h3>
                    <i class="iconfont icon-yuangong"></i>
                    员工管理
                </h3>
                <nav class="item">
                    <a href="page/userlist.html" target="iframeBox">员工列表</a>
                    <a href="page/useradd.html" target="iframeBox">新增员工</a>
                </nav>
            </div>`
        }
        if (power.includes("departhandle")) {
            str += `<div class="itemBox" text="部门管理">
                <h3>
                    <i class="iconfont icon-guanliyuan"></i>
                    部门管理
                </h3>
                <nav class="item">
                    <a href="page/departmentlist.html" target="iframeBox">部门列表</a>
                    <a href="page/departmentadd.html" target="iframeBox">新增部门</a>
                </nav>
            </div>`
        }
        if (power.includes("jobhandle")) {
            str += `<div class="itemBox" text="职务管理">
                <h3>
                    <i class="iconfont icon-zhiwuguanli"></i>
                    职务管理
                </h3>
                <nav class="item">
                    <a href="page/joblist.html" target="iframeBox">职务列表</a>
                    <a href="page/jobadd.html" target="iframeBox">新增职务</a>
                </nav>
            </div>`
        }
        str += `<div class="itemBox" text="客户管理">
                <h3>
                    <i class="iconfont icon-kehuguanli"></i>
                    客户管理
                </h3>
                <nav class="item">
                    <a href="page/customerlist.html?lx=my#111" target="iframeBox">我的客户</a>
                    ${power.includes("customerall") ?
                '<a href="page/customerlist.html?lx=all" target="iframeBox">全部客户</a>' : ''}
                    <a href="page/customeradd.html" target="iframeBox">新增客户</a>
                </nav>
            </div>`
        menuBox.innerHTML = str;
        menuBoxItem = document.querySelectorAll(".itemBox");
        tab("客户管理");//渲染的时候默认渲染  客户管理
    }

    function tab(value) {
        //1.标题切换
        navBoxa.forEach(item => {
            if (item.innerHTML == value) {
                item.className = "active"
            } else {
                item.className = "";
            }
        })

        //2.内容切换 
        menuBoxItem.forEach(boxItem => {
            let text = boxItem.getAttribute("text");
            if (value == "客户管理") {//客户管理---客户管理（显示）  其余隐藏
                boxItem.style.display = text=="客户管理"?"block":"none";
            } else {//组织结构---员工管理、部门管理、职务管理（显示） 客户管理隐藏
                boxItem.style.display = text=="客户管理"?"none":"block";
            }
        })

    }

    //安全退出和切换-------事件委托---登录成功后
    function handle(power) {
        headerBox.onclick = function (e) {
            if (e.target.tagName === "A") {
                if (e.target.innerHTML == "安全退出") {
                    //正常逻辑，调用退出接口
                    location.href = "./login.html";//返回登录页
                    localStorage.removeItem("abcToken");//删除token
                }

                if (e.target.innerHTML == "客户管理") {
                    tab("客户管理")
                }

                if (e.target.innerHTML == "组织结构") {
                    if(power.includes("userhandle")||power.includes("departhandle")||power.includes("jobhandle")){
                        tab("组织结构")
                    }else{
                        alert("无权限");
                    }
                    
                }
            }
        }
    }

})()