(function(){
	//console.log(location.href)
	let customerId=location.href.queryParams("customerid");
	
	let username=document.querySelector(".username");
	let man=document.getElementById("man");
	let woman=document.getElementById("woman");
	let useremail=document.querySelector(".useremail");
	let userphone=document.querySelector(".userphone");
	let userqq=document.querySelector(".userqq");
	let userweixin=document.querySelector(".userweixin");
	let usertype=document.querySelector(".usertype");
	let useraddress=document.querySelector(".address");
	let submit=document.getElementById("submit");
	let usernameSpan=document.querySelector(".usernameSpan");
	if(customerId){//编辑
		render();
	}
	//渲染编辑的内容
	async function render(){
		let {code,info}= await axios.get("/customer/info",{
			params:{
				customerId
			}
		})
		if(+code!==0){return}
		let {id,
			name,
			sex,
			email,
			phone,
			QQ,
			weixin,
			type,
			address,
			userId,
			userName,
			departmentId,
			department}=info;
			
		username.value=name;
		+sex==0?man.checked=true:woman.checked=true;
		useremail.value=email;
		userphone.value=phone;
		userqq.value=QQ;
		userweixin.value=weixin;
		usertype.value=type;
		useraddress.value=address;
	}
	
	const validateName=function validateName(){
		let name=username.value.trim();
		let reg=/^([\u4e00-\u9fa5]{2,})(·[\u4e00-\u9fa5]{2,})?$/;
		if(name.length==0){
			usernameSpan.innerHTML="用户名不能为空！";
			return false;
		}
		if(reg.test(name)){
			return true;
		}else{
			usernameSpan.innerHTML="用户名格式不正确！";
			return false;
		}
	}
	//点击确认按钮2种情况------1.修改完成提交  2.新增提交
	submit.onclick=async function(){
		if(!validateName()){return;}
		let name=username.value.trim();
		let sex=man.checked?0:1;
		let email=useremail.value.trim();
		let phone=userphone.value.trim();
		let QQ=userqq.value.trim();
		let weixin=userweixin.value.trim();
		let type=usertype.value.trim();
		let address=useraddress.value.trim();
		let obj={name,sex,email,phone,QQ,weixin,type,address};
		if(customerId){//1.修改完成提交
		    obj["customerId"]=customerId;
			let result=await axios.post("/customer/update",obj);
			if(+result.code!==0){return}
			location.href="customerlist.html";
		}else{// 2.新增提交
		    let result=await axios.post("/customer/add",obj);
			if(+result.code!==0){return}
			location.href="customerlist.html";
		}
	}
})()