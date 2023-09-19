(function(){
	let userName=document.querySelector(".userName");
	let userPass=document.querySelector(".userPass");
	let submit=document.querySelector(".submit");
	let account,password;
	
	const validateName=function validateName(){
		//真实姓名 迪丽·热巴
		let reg1=/^([\u4e00-\u9fa5]{2,})(·[\u4e00-\u9fa5]{2,})?$/;
		let reg2=/^1[3-9]\d{9}$/;
		let reg3=/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		
		if(account.length===0){
			alert("用户名不能为空！");
			return false;
		}
		
		if(reg1.test(account)||reg2.test(account)||reg3.test(account)){
			return true;
		}else{
			alert("用户名格式不正确！");
			return false;
		}
		
	}
	const validatePass=function validatePass(){
	    // 6-16 字母 数字 下划线
		let reg1=/^\w{6,16}$/;
		
		if(password.length===0){
			alert("密码不能为空！");
			return false;
		}
		
		if(reg1.test(password)){
			return true;
		}else{
			alert("密码格式不正确！");
			return false;
		}
		
	}
	
	async function login(){
		account=userName.value.trim();
		password=userPass.value.trim();
		
		if(!validateName()){
			return;
		}
		if(!validatePass()){
			return;
		}
		
		let {code,info,token}=await axios.post("/user/login",{
			account,
			password:md5(password)
		})
		
		if(+code!==0){
			alert("登录失败请重试！")
		}else{
			localStorage.setItem("info",JSON.stringify(info));
			localStorage.setItem("token",token);
			location.href="index.html";
		}
	}
	
	submit.onclick=login;
	userPass.onkeydown=function(e){
		if(e.keyCode==13){
			login();
		}
	}
})()