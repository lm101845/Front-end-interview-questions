(function(){
	let userId=location.href.queryParams("userId");
	let username=document.querySelector(".username");
	let man=document.getElementById("man");
	let woman=document.getElementById("woman");
	let useremail=document.querySelector(".useremail");
	let userphone=document.querySelector(".userphone");
	let userdepartment=document.querySelector(".userdepartment");
	let userjob=document.querySelector(".userjob");
	let userdesc=document.querySelector(".userdesc");
	let submit=document.querySelector(".submit");
	//部门信息获取和渲染
	async function getdepartment(){
		let data=localStorage.getItem("departmentmsg");
		if(data){
			data=JSON.parse(data);
		}else{
			let result = await axios.get("/department/list");
			//console.log(result);
			if(+result.code!==0){return}
			localStorage.setItem("departmentmsg",JSON.stringify(result.data));
			data=result.data;
		}
		
		let str="";
		data.forEach(item=>{
			let {id,name,desc}=item;
			str+=`<option value="${id}">${name}</option>`
		})
		userdepartment.innerHTML=str;
	}
	//职务信息获取和渲染
	async function getjob(){
		let data=localStorage.getItem("jobmsg");
		if(data){
			data=JSON.parse(data);
		}else{
			let result = await axios.get("/job/list");
			///console.log(result);
			if(+result.code!==0){return}
			localStorage.setItem("jobmsg",JSON.stringify(result.data));
			data=result.data;
		}

		let str="";
		data.forEach(item=>{
			let {id,name,desc}=item;
			str+=`<option value="${id}">${name}</option>`
		})
		userjob.innerHTML=str;
	}
	
	async function render(){
		let {code,info}=await axios.get("/user/info",{
			params:{userId}
		})
		if(+code!==0){return}
		let {department,
			departmentId,
			desc,
			email,
			id ,
			job,
			jobId,
			name,
			phone,
			power,
			sex}=info;
		
		username.value=name;
		+sex==0?man.checked=true:woman.checked=true;
		useremail.value=email;
		userphone.value=phone;
		userdepartment.value=departmentId;//部门 渲染不上去
		userjob.value=jobId;
		userdesc.value=desc;
	}
	
	//*********必须先获取 部门数据 职务的数据，才能去渲染
	Promise.all([getdepartment(),getjob()]).then(()=>{
		if(userId){//编辑页面
			render();//渲染编辑页面
		}
	})
	
	submit.onclick=async function(){
		let name=username.value.trim();
		let sex=man.checked==true?0:1;
		let email=useremail.value.trim();
		let phone=userphone.value.trim();
		let departmentId=userdepartment.value;
		let jobId=userjob.value;
		let desc=userdesc.value.trim();
		let obj={name,sex,email,phone,departmentId,jobId,desc};
		if(userId){//编辑
			obj["userId"]=userId;
			console.log(obj);
			let result=await axios.post("/user/update",obj)
			if(+result.code!==0){
				alert("编辑失败！")
				return;
			}
			location.href="userlist.html";
		}else{//新增
			let result=await axios.post("/user/add",obj)
			if(+result.code!==0){
				alert("添加失败！")
				return;
			}
			location.href="userlist.html";
		}
	}
	
	
	
	
})()