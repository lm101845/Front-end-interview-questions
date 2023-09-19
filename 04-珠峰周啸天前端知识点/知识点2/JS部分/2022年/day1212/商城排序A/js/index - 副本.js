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

   //功能区域 价格 时间 热度
    function handle(){
		//价格 添加点击事件
		let flaga=-1;
		lis[0].onclick=function(){
			flaga*=-1;//flaga=flaga*-1   1 -1   1 -1 ...
			//按照价格升序(a-b)  降序(b-a)---修改数据
			data.sort((a,b)=>{
				//(a.price-b.price)*1   a.price-b.price  升序
				//(a.price-b.price)*-1  b.price-a.price  降序
				return (a.price-b.price)* flaga;
			})
			
			render();//重新渲染页面
		}
		
		let flagb=-1;
		//时间 添加点击事件
		lis[1].onclick=function(){
			flagb*=-1;
			data.sort((a,b)=>{
				//time 字符串，没法排序，数值
				//将”日期字符串“变成数值，而且还要有大小
				a=new Date(a.time).getTime();//当前时间距离元年的毫秒数
				b=new Date(b.time).getTime();//当前时间距离元年的毫秒数
				return (a-b)*flagb;
			})
			render();
		}
		
		//热度 添加点击事件
		let flagc=-1;
		lis[2].onclick=function(){
			flagc*=-1;
			data.sort((a,b)=>{
				return (a.hot-b.hot)* flagc;
			})
			render();
		}
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
