let product = (function() {
	let data = null; //接收获取的json 数据
	let row = document.querySelector(".row"); //内容区域
	let lis = Array.from(document.getElementsByTagName("li"));//价格 时间 热度 的三个按钮
	//类数组集合===》不能用forEach     变成数组 Array.from()
	//let lis = document.querySelectorAll(".navbar-nav li");//价格 时间 热度 的三个按钮
	
	//获取数据的方法---ajax 四步
	function getData() {
		let xhr = new XMLHttpRequest;

		xhr.open("GET", "product.json", false);

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				data = JSON.parse(xhr.response);
				//console.log(data);
			}
		}

		xhr.send();
	}

	//循环渲染页面
	function render() {
		let str = "";
		data.forEach(item => {
			let {title,price,time,hot,img}=item;
			str +=`<div class="col-md-3 col-sm-6 col-xs-12">
						<div class="thumbnail" style="height:500px;">
						      <img src="${img}">
						      <div class="caption">
						        <h3>${title}</h3>
						        <p>价格: ￥${price}</p>
								<p>时间: ${time}</p>
								<p>热度: ${hot}</p>
						      </div>
						</div>
					</div>`
		})
		//给 row 添加 内容 str
		row.innerHTML = str;
	}

    function clear(liItem){
		//liItem 当前点击的哪项 flag 不修改，其余的li身上的flag 都改为-1
		lis.forEach(item=>{
			if(liItem!=item){
				item.flag=-1;
			}
		})
	}
   //功能区域 价格 时间 热度
    function handle(){
		lis.forEach(liItem=>{
			liItem.flag=-1;//给每个li身上都添加一个自己私有的属性 flag
			liItem.onclick=function(){
				clear(liItem);//liItem 当前点击的哪项
				liItem.flag*=-1;
				//获取点击元素的 属性 price  time  hot
				let dataName=liItem.getAttribute("data-name");
				data.sort((a,b)=>{
					//时间 需要额外处理
					if(dataName=="time"){
						a=new Date(a.time).getTime();
						b=new Date(b.time).getTime();
						return (a-b)*liItem.flag;
					}
					return (a[dataName]-b[dataName])*liItem.flag
				})
				
				render();//重新渲染页面
			}
		})
	}
	return { //返回对象，对象里面含有 init 初始化方法===>product
		init() { //init 初始化
			getData() //获取数据的方法
			render() //循环渲染页面
			handle()//功能区域
		}
	}
})()

//调用初始化方法
product.init()
