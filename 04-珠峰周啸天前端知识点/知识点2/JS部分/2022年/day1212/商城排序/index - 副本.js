let product=(function(){
	let data=null;
	//渲染1.找到盒子
	let con =document.getElementById("con");
	//功能1. 找到三个li
	let lilist=document.getElementsByTagName("li");
	//1.获取数据
	function getData(){
		//1.创建一个XMLHttpRequest核心对象
		let xhr=new XMLHttpRequest();
		//2.建立连接
		xhr.open("GET","product.json",false);
		//3.注册监听
		xhr.onreadystatechange=function(){
			if(xhr.readyState===4&&xhr.status===200){
                //将jsong格式----》对象
				data=JSON.parse(xhr.responseText)
				console.log(data);
			}
		}
		//4.发送数据
		xhr.send(null);
	}
	//渲染数据
	function render(){
		//str 内容 空的
		let str="";
		data.forEach((item)=>{
			let {title,price,time,hot,img}=item;
			str+=`<div class="col-md-3">
			    <div class="thumbnail">
			      <img src="${img}" style="height:280px;">
			      <div class="caption">
			        <h3>${title}</h3>
			        <p>价格: ￥${price}</p>
					<p>时间: ${time}</p>
					<p>热度: ${hot}</p>
			      </div>
			    </div>
			  </div> `
		})
		//con盒子里添加内容
		con.innerHTML=str;
	}
	//功能部分
	function handle(){
		//2.给li绑定事件
		//console.log(lilist);
		let flaga=-1;//-1
		lilist[0].onclick=function(){
			flaga=flaga*-1;//-1*-1=1   1*-1=-1  -1*-1=1
			data.sort(function(a,b){
				return (a.price-b.price)*flaga;//()*1  ()*-1  ()*1
			})
			console.log(data);
			//重新渲染页面
			render();
		}
		
		let flagb=-1;//-1
		lilist[1].onclick=function(){
			flagb=flagb*-1;//-1*-1=1   1*-1=-1  -1*-1=1
			data.sort(function(a,b){
				a=new Date(a.time).getTime();
				b=new Date(b.time).getTime();
				return (a-b)*flagb;//()*1  ()*-1  ()*1
			})
			console.log(data);
			//重新渲染页面
			render();
		}
		
		let flagc=-1;//-1
		lilist[2].onclick=function(){
			flagc=flagc*-1;//-1*-1=1   1*-1=-1  -1*-1=1
			data.sort(function(a,b){
				return (a.hot-b.hot)*flagc;//()*1  ()*-1  ()*1
			})
			console.log(data);
			//重新渲染页面
			render();
		}
		
	}
	return{
		init(){
			getData();
			render();
			handle();
		}
	}
})()

product.init();