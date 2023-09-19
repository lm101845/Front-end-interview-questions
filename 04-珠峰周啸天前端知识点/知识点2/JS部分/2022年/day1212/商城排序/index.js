let product=(function(){
	let data=null;
	//渲染1.找到盒子
	let con =document.getElementById("con");
	//功能1. 找到三个li
	//将集合（类数组）----》数组
	let lilist=Array.from(document.getElementsByTagName("li"));
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
	function clear(n){// n---》当前点击的哪一项
	   //循环三个li
		lilist.forEach(item=>{
			if(item!=n){//不是当前点击的哪项，剩余的两项，恢复初始值
				item.flag=-1
			}
		})
	}
	//功能部分
	function handle(){
		//2.给li绑定事件
		lilist.forEach((item)=>{//循环每个li
			item.flag=-1;//给每个li 添加一个 flag 属性，每个flag 属性相互独立
			item.onclick=function(){//给每个li 绑定点击事件
			    clear(item);//恢复初始 flag---》-1
			    //获取 li 身上，自己给他添加的data-title  price/time/hot 
				let title=item.getAttribute("data-title");
				this.flag*=-1;//修改当前点击li 添加flag  -1*-1=1  1*-1=-1 ...
				data.sort((a,b)=>{//数据进行排序
					if(title=="time"){//time 特殊处理
						a=new Date(a.time).getTime();
						b=new Date(b.time).getTime();
						return (a-b)*this.flag;
					}
					return (a[title]-b[title])*this.flag;//price，hot 处理
				})
				//重新渲染页面
				render();
			}
		})
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