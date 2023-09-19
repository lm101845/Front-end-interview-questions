(function(){
	let baseBoxspan=document.querySelector(".baseBox span");//你好XXX
	let headerBox=document.querySelector(".headerBox");//整个导航
	let menuBox=document.querySelector(".menuBox");//左侧列表盒子
	let navBoxlist=Array.from(document.querySelectorAll(".navBox a"))//tab点击按钮--2个
	let menuBoxContent=null;//左侧内容是渲染上去的
	
	//1. 先校验是否登录
	const isLogin=async function isLogin(){
		let {code,info}=await axios.get("/user/login")
		if(+code===0){//已经登录
		   //各种功能
		   //1. 显示用户信息 
		   baseBoxspan.innerHTML=`您好：${info.name}`;
		  //2.功能部分  2.1安全退出  2.2 客户管理   2.3组织结构
		    handle(info.power)
		  //3.渲染左侧列表----info.power
		   render(info.power);
		}else{//没有登录
		    alert("请先登录");
		    //返回登录页面重新登录
			location.href="login.html";
		}
	}
	isLogin()
	
	//渲染左侧列表
	function render(power){
		console.log(power);
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
		//不论有没有 customerall 这个权限，一定具有  “客户管理”
		//  customerall----->全部客户
		str+=`<div class="itemBox" text="客户管理">
				<h3>
					<i class="iconfont icon-kehuguanli"></i>
					客户管理
				</h3>
				<nav class="item">
					<a href="page/customerlist.html?lx=my#111" target="iframeBox">我的客户</a>
					${
						power.includes("customerall")?`<a href="page/customerlist.html?lx=all" target="iframeBox">全部客户</a>`:""
					}
					<a href="page/customeradd.html" target="iframeBox">新增客户</a>
				</nav>
			</div> `
		menuBox.innerHTML=str;
		//四个内容是渲染后获得的
		menuBoxContent=Array.from(document.querySelectorAll(".menuBox .itemBox"));
		
		//一打开页面，让他默认显示 组织结构
		tab("组织结构");
	}
	
	function tab(value){
		//tab 按钮高亮
		navBoxlist.forEach(item=>{
			if(item.innerHTML==value){
				item.className="active";
			}else{
				item.className="";
			}
		})
		
		//tab 内容切换
		menuBoxContent.forEach(item=>{
			let text=item.getAttribute("text");//客户管理 员工管理  部门管理 职务管理
			if(value=="客户管理"){//value---》客户管理   客户管理显示，剩余三个隐藏
				item.style.display=text=="客户管理"?"block":"none";
			}else{//value-->组织结构   三个显示，客户管理隐藏
				item.style.display=text=="客户管理"?"none":"block";
			}
		})
	}
	//功能部分
	function handle(power){
		//事件委托
		headerBox.onclick=function(e){
			//安全退出
			if(e.target.tagName=="A"&&e.target.innerHTML=="安全退出"){
				//首页关闭（删除客户端存储的token），去登录页面
				localStorage.removeItem("token");
				localStorage.removeItem("info");
				location.href="login.html";//去登录页面
				return;
			}
			
			//客户管理
			if(e.target.tagName=="A"&&e.target.innerHTML=="客户管理"){
				tab("客户管理");//切换效果
				return;
			}
			
			//组织结构
			if(e.target.tagName=="A"&&e.target.innerHTML=="组织结构"){
				//只有 customerall 这一个权限，给一个提示，不展示了
				if(power.includes("userhandle")||power.includes("departhandle")||power.includes("jobhandle")){
					tab("组织结构");//切换效果
				}else{
					alert("权限不足！");
				}
				
			}
			
		}
		
	}
})()