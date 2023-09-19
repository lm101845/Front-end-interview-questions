(function(){
	//区分我的客户(my) 全部客户(all)    默认----我的客户(my) 
	let urlLx=location.href.queryParams("lx")||"my";
	
	let selectBox=document.querySelector(".selectBox");
	let searchInp=document.querySelector(".searchInp");
	let tbody=document.querySelector("tbody");
	let pageBox=document.querySelector(".pageBox");
	let limit=10;//每页显示多少条数据
	let page=1;//当前的页码
	let type,search;
	
    //获取 表格和分页 数据，渲染 表格和分页
	async function render(){
		type=selectBox.value;
		search=searchInp.value.trim();
		let obj={
			lx:urlLx,
			type,
			search,
			limit,
			page
		}
	    //获取 表格和分页 数据
		let result=await axios.get("/customer/list",{
			params:obj
		})
		if(+result.code!==0){
			return;
		}
		//循环渲染table
		let str="";
		result.data.forEach(item=>{
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
				department}=item
			str+=` <tr>
				<td class="w8">${name}</td>
				<td class="w5">${sex==0?"男":"女"}</td>
				<td class="w10">${email}</td>
				<td class="w10">${phone}</td>
				<td class="w10">${weixin}</td>
				<td class="w10">${QQ}</td>
				<td class="w5">${type}</td>
				<td class="w8">${userName}</td>
				<td class="w20">${address}</td>
				<td class="w14">
					<a href="customeradd.html?customerid=${id}">编辑</a>
					<a href="javascript:;" data-id="${id}">删除</a>
					<a href="visit.html?id=${id}">回访记录</a>
				</td>
			</tr>`
		})
		tbody.innerHTML=str;
		
		//渲染页码
		let str2="";
		if(page>1){
			str2+=`<a href="javascript:;">上一页</a>`;
		}
		//总页数大于1，才显示页码  1页页码就没有必要显示了
		if(result.totalPage>1){
			str2+=`<ul class="pageNum">`
			for(let i=1;i<=result.totalPage;i++){
				str2+=`<li class="${page==i?'active':''}">${i}</li>`
			}
			str2+=`</ul>`
		}
		
		if(page<result.totalPage){
			str2+=`<a href="javascript:;">下一页</a>`
		}
		pageBox.innerHTML=str2;
	}
	render();
	
	//点击页码切换页面
	pageBox.onclick=function(e){
		//上一页
		if(e.target.tagName=="A"&&e.target.innerHTML=="上一页"){
			page--;
		}
		//点击具体页码
		if(e.target.tagName=="LI"){
			//console.log(+e.target.innerHTML);
			page=+e.target.innerHTML;
		}
		//下一页
		if(e.target.tagName=="A"&&e.target.innerHTML=="下一页"){
			page++;
		}
		render();
	}
	
	//下拉筛选
	selectBox.onchange=function(){
		page=1;
		render();
	}
	
	//搜索框搜索
	searchInp.onkeydown=function(e){
		if(e.keyCode==13){
			page=1;
			render();
		}
	}
	
	//删除
	tbody.onclick=async function(e){
		if(e.target.tagName=="A"&&e.target.innerHTML=="删除"){
			let aid=+e.target.getAttribute("data-id");
			if(confirm(`你确定要删除客户${aid}吗?`)){
				let {code}=await axios.get("/customer/delete",{
					params:{customerId:aid}
				})
				if(+code===0){
					alert("删除成功！")
					render();
				}else{
					alert("删除失败！请重试")
				}
			}
		}
	}
})()