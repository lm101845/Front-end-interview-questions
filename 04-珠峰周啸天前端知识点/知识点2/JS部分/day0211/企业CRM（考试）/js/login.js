(function(){
	//找到登录按钮
	let submit=document.querySelector(".submit");
	let userName=document.querySelector(".userName");//用户名
	let userPass=document.querySelector(".userPass");//密码
	//用户名格式校验
	const validateName=function validateName(){
		let at=userName.value.trim();//获取用户名的值，去掉前后空格
		//真实姓名 手机号 邮箱
		let reg1=/^([\u4e00-\u9fa5]{2,})(·[\u4e00-\u9fa5]{2,})?$/;//真实姓名
		let reg2=/^1[3-9]\d{9}$/; //手机号
		let reg3=/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;//邮箱
		
		if(at.length<=0){//用户名没有输入内容
			alert("用户名不能为空！");
			return false;
		}
		
		//用户名有输入内容
		if(reg1.test(at)||reg2.test(at)||reg3.test(at)){//满足条件  真实姓名 手机号 邮箱 其中之一
			return true;
		}else{
			alert("用户名格式不正确！")
			return false;
		}
	}
	//密码格式校验
	const validatePass=function validatePass(){
		let ps=userPass.value.trim();//获取密码的值，去掉前后空格
		//6-16 字母，数字，下划线
		let reg1=/^\w{6,16}$/;
		
		if(ps.length<=0){
			alert("密码不能为空！");
			return false;
		}
		
		if(reg1.test(ps)){
			return true;
		}else{
			alert("密码格式不正确！");
			return false;
		}
		
	}
	//登录函数
	const login=async function login(){
		let at=userName.value.trim();//获取用户名的值，去掉前后空格
		let ps=userPass.value.trim();//获取密码的值，去掉前后空格
		//发送ajax之前，我先校验格式
		if(validateName()===false){
			return;//中断，不在发送请求
		}
		if(!validatePass()){
			return;//中断，不在发送请求
		}
		
		//必须格式校验正确，才发送请求
		let result=await axios.post("/user/login",{
			account:at,
			password:md5(ps)//密码md5加密
		})
		
		if(+result.code!==0){//code=1
		    alert("登录失败，请重新登录！")
		}else{//code=0
			//进入首页
			location.href="index.html";
			//获取token,存储到localStorage，直接存“字符串”  token-->字符串
			localStorage.setItem("token",result.token);
			//info,有可能会用到，也存一下  info--->对象  先转字符串JSON.stringify()
			localStorage.setItem("info",JSON.stringify(result.info));
		}
	}
	
	//点击登录按钮
	submit.onclick=login;
	
	//在密码框的最后按回车，也能登录
	userPass.onkeydown=function(e){
		if(e.keyCode==13){//13--->Enter
			login();
		}
	}
})()