(function(){
	//下拉列表
	let selectBox=document.querySelector(".selectBox");
	//input框
	let searchInp=document.querySelector(".searchInp");
	let tbody=document.querySelector("tbody");
	let checkAll=document.getElementById("checkAll");
	let deleteAll=document.querySelector(".deleteAll");
	let newdata=null;
	//获取员工的信息,数据处理
	async function getData(){
		//获取员工的信息
		let departmentId=selectBox.value||0;
		let search=searchInp.value.trim();
		let {code,data}=await axios.get("/user/list",{
			params:{departmentId,search}
		})
		if(+code!==0){return}
		
		//默认数据没有 checked 选中状态，我给添加一个选中状态
		newdata=data.map(item=>{
			item.selected=false;
			return item;
		})
		render();//渲染员工列表
	}
	getData()
	// 渲染员工列表
	function render(){
		let str="";
		newdata.forEach(item=>{
			let {id,
				name,
				sex,
				email,
				phone,
				departmentId,
				department,
				job,
				desc,
				selected
				}=item;
			str+=`<tr>
				<td class="w3">
				   ${id==1?"":`<input type="checkbox" ${selected==true?"checked":""} data-id="${id}">`}
				</td>
				<td class="w10">${name}</td>
				<td class="w5">${+sex==0?"男":"女"}</td>
				<td class="w10">${department}</td>
				<td class="w10">${job}</td>
				<td class="w15">${email}</td>
				<td class="w15">${phone}</td>
				<td class="w20">${desc}</td>
				<td class="w12">
					<a href="useradd.html?userId=${id}">编辑</a>
					<a href="javascript:;" data-id=${id}>删除</a>
					<a href="javascript:;" data-id=${id}>重置密码</a>
				</td>
			</tr> `
		})
		tbody.innerHTML=str;
	}
	//下拉列表数据获取 + 渲染
	async function getlist(){
	    let data=localStorage.getItem("departmentmsg");
		if(data){
			data=JSON.parse(data);
		}else{
			let result=await axios.get("/department/list");
			if(+result.code!==0){return}
			localStorage.setItem("departmentmsg",JSON.stringify(result.data));
			data=result.data;
		}
		let str="";
		data.forEach(item=>{
			let {id,name,desc}=item;
			str+=`<option value="${id}">${name}</option>`;
		})
		selectBox.innerHTML+=str;
	}
	getlist()
	
	//下拉列表筛选
	selectBox.onchange=function(){
		getData();
	}
	//搜索
	searchInp.onkeydown=function(e){
		if(e.keyCode===13){
			getData();
		}
	}
    
	//全选和全不选
	checkAll.onclick=function(){
		//console.log(checkAll.checked);
		newdata.map(item=>{
			item.selected=checkAll.checked;
			if(item.id==1){//除了高级管理员不选中，一直为fasle,其他根据checkAll.checked值进行变化
				item.selected=false;
			}
			return item;
		})
		render();
	}
	//事件委托
	tbody.onclick=async function(e){
		//1.点击单个 checkbox
		if(e.target.tagName=="INPUT"){
			//改变 newdata中seletced的值（点击的那项）
			let flag=e.target.checked;
			let aid=+e.target.getAttribute("data-id");
			newdata.map(item=>{
				if(item.id==aid){
					item.selected=flag;
				}
				return item;
			})
			//看数据----》seletced（true) ,除了第一个之外
			//every()--->全部为真，结果为真
			//some()--->只要有一个结果为真，结果为真
			let bol=newdata.every(item=>{
				if(item.id==1){//除了第一个之外
					return true;
				}
				return item.selected==true;
			})
			checkAll.checked=bol;
		}
	    // 2. 单个元素删除
		if(e.target.tagName=="A"&&e.target.innerHTML=="删除"){
			let id=+e.target.getAttribute("data-id");
			if(id==1){
				alert("你没有权限删除！");
				return;
			}
			if(confirm(`你确定要删除${id}吗?`)){
				let result=await axios.get("/user/delete",{
					params:{
						userId:id
					}
				})
				if(+result.code!==0){
					alert("删除失败！")
					return;
				}
				alert("删除成功！");
				getData();//重新获取数据，渲染
			}
		}
	    //3.重置密码  修改其他人的
		if(e.target.tagName=="A"&&e.target.innerHTML=="重置密码"){
			let id=+e.target.getAttribute("data-id");
			if(confirm(`你确定要修改${id}的密码吗?`)){
				let {code}=await axios.post("/user/resetpassword",{
					userId:id
				})
				if(+code!==0){
					alert("修改密码失败");
					return;
				}
				alert("恭喜你，密码修改成功！");
			}
		}
	}
	
	//批量删除
	deleteAll.onclick=function(){
		//查找出，我数据中 selected 为true
		let arr=newdata.filter(item=>{
			return item.selected==true;
		})
		if(arr.length<=0){
			alert("请先选中元素！");
			return;
		}
		
		if(confirm(`你确定要删除这${arr.length}个吗?`)){
			del();//递过
		}
		
		async function del(){
			if(arr.length<=0){//停止递过
				alert("批量删除成功！");
				getData();
				return;
			}
			let id=arr.shift().id;//从数组的头部出栈
			
			let result=await axios.get("/user/delete",{
				params:{
					userId:id
				}
			})
			if(+result.code!==0){
				alert("批量删除失败！");
				return;
			}
			del();
		}
	}
})()