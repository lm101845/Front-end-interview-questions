(function(){
	let baseBoxSpan=document.querySelector(".baseBox span");
	let headerBox=document.querySelector(".headerBox");
	let menuBox=document.querySelector(".menuBox");
	let navBoxa=Array.from(document.querySelectorAll(".navBox a"));
	let itemBox=null;
	let info=JSON.parse(localStorage.getItem("info"));
	console.log(info);
	let power=info.power;
	//判断是否登录
	async function isLogin(){
		let {code}=await axios.get("/user/login");
		if(+code===0){//获取数据，渲染页面
		    //显示用户姓名
			baseBoxSpan.innerHTML="您好: "+info.name;
			//功能 点击安全退出  客户管理 组织结构
			handle();
			//渲染左侧列表--power
			render();
		}else{//返回登录页面，重新登录
		    alert("请先登录！");
			location.href="login.html";
		}
	}
	isLogin()
	
	function render(){
		let str="";
		if(power.includes("userhandle")){
			str+=`<div class="itemBox" text="员工管理">
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
		if(power.includes("departhandle")){
			str+=`<div class="itemBox" text="部门管理">
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
		if(power.includes("jobhandle")){
			str+=`<div class="itemBox" text="职务管理">
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
		str+=`<div class="itemBox" text="客户管理">
				<h3>
					<i class="iconfont icon-kehuguanli"></i>
					客户管理
				</h3>
				<nav class="item">
					<a href="page/customerlist.html?lx=my#111" target="iframeBox">我的客户</a>
					${power.includes("customerall")?`<a href="page/customerlist.html?lx=all" target="iframeBox">全部客户</a>`:``}
					<a href="page/customeradd.html" target="iframeBox">新增客户</a>
				</nav>
			</div>`
			
		menuBox.innerHTML=str;
		//必须渲染完后，找itemBox
		itemBox=document.querySelectorAll(".itemBox");
		//以打开页面，默认要显示一项 客户管理
		tab("客户管理")
		//tab("组织结构")
	}
	
	function tab(value){
		//切换高亮
		navBoxa.forEach(item=>{
			if(item.innerHTML==value){
				item.className="active";
			}else{
				item.className="";
			}
		})
		//切换内容
		itemBox.forEach(item=>{
			let text=item.getAttribute("text");
			if(value=="客户管理"){//客户管理显示， 三项隐藏
				item.style.display=text=="客户管理"?"block":"none";
			}else if(value=="组织结构"){//三项显示，客户管理隐藏
				item.style.display=text=="客户管理"?"none":"block";
			}
		})
	}
	
	function handle(){
		//事件委托
		headerBox.onclick=function(e){
			//安全退出
			if(e.target.tagName=="A"&&e.target.innerHTML=="安全退出"){
				location.href="login.html";
				localStorage.removeItem("token");
				localStorage.removeItem("info");
				return;
			}
			
			if(e.target.tagName=="A"&&e.target.innerHTML=="客户管理"){
				tab("客户管理");
				return;
			}
			
			if(e.target.tagName=="A"&&e.target.innerHTML=="组织结构"){
				if(power.includes("userhandle")||power.includes("departhandle")||power.includes("jobhandle")){
					tab("组织结构");
				}else{
					alert("你没有访问权限！");
				}
			}
		}
	}
})()