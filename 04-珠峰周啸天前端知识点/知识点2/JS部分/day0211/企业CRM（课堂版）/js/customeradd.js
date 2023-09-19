(function(){
	//1.通过问号传参，区分编辑（customerId=XXX） 还是新增
    //console.log(location.search);
    let customerId=location.href.queryParams("customerId");// 11  undefined
    let username=document.querySelector(".username");//用户名
    let usernameSpan=document.querySelector(".usernameSpan");//用户名校验提示区域
    let man=document.getElementById("man");//性别男
    let woman=document.getElementById("woman");//性别女
    let useremail=document.querySelector(".useremail");//邮箱
    let useremailSpan=document.querySelector(".useremailSpan");
    let userphone=document.querySelector(".userphone");//电话
    let userqq=document.querySelector(".userqq");//QQ
    let userweixin=document.querySelector(".userweixin");//微信
    let usertype=document.querySelector(".usertype");//下拉列表的类型
    let useraddress=document.querySelector(".address");//地址
    let submit=document.querySelector(".submit");//提交

    if(customerId){//编辑---获取数据，渲染
      getData();
    }

    //获取数据，渲染
    async function getData(){
        let {code,info}=await axios.get("/customer/info",{
            params:{
                customerId 
            }
        })
        if(+code!==0){return}

        let {name,sex,email,phone,QQ,weixin,type,address}=info;
       
        username.value=name;
        +sex===0?man.checked=true:woman.checked=true;
        useremail.value=email;
        userphone.value=phone;
        userqq.value=QQ;
        userweixin.value=weixin;
        usertype.value=type;
        useraddress.value=address;
    }
    
    //校验用户名
    function validateName(){
        let name=username.value.trim();
        if(name.length<=0){
            usernameSpan.innerHTML="用户名不能为空";
            return false;
        }
        let reg=/^(?:[\u4e00-\u9fa5·]{2,16})$/;
        if(reg.test(name)){
            return true;
        }else{
            usernameSpan.innerHTML="用户名格式不对";
            return false;
        }
    }
    //校验邮箱
    function validateEmail(){
        let email=useremail.value.trim();
        if(email.length<=0){
            useremailSpan.innerHTML="邮箱不能为空";
            return false;
        }
        let reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if(reg.test(email)){
            return true;
        }else{
            useremailSpan.innerHTML="邮箱格式不对";
            return false;
        }
    }


    submit.onclick= async function(){
        if(!validateName()||!validateEmail()){return}

        let name=username.value.trim();
        let sex= man.checked?0:1;
        let email=useremail.value.trim();
        let phone=userphone.value.trim();
        let weixin=userweixin.value.trim();
        let QQ=userqq.value.trim();
        let type=usertype.value;
        let address=useraddress.value.trim();
        let obj={
            name,
            sex,
            email,
            phone,
            weixin,
            QQ,
            type,
            address
        }

        if(customerId){//修改
            obj["customerId"]=customerId;
            let {code}=await axios.post("/customer/update",obj);
            if(+code!==0){
                alert("编辑失败，请重试！");
            }else{
                alert("恭喜你，编辑成功！");
                location.href="customerlist.html";
            }
        }else{//新增
            let {code}=await axios.post("/customer/add",obj);
            if(+code!==0){
                alert("新增失败，请重试！");
            }else{
                alert("恭喜你，新增成功！");
                location.href="customerlist.html";
            }
        }
    }

})()