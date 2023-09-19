let product=(function(){
	let data=null;
	let box_top=document.querySelector(".box_top");
	let box_bottom=document.querySelector(".box_bottom");
	//1.获取数据
	function getData(){
		//创建核心对象
		let xhr=new XMLHttpRequest;
		//建立连接
		xhr.open("GET","data.json",false);
		//注册监听
		xhr.onreadystatechange=function(){
			if(xhr.readyState===4&&xhr.status===200){
				data=JSON.parse(xhr.response);
				console.log(data);
			}
		}
		//发送数据
		xhr.send(null);
	}
	//2.循环渲染
	function render(){
		let allcount=0;//总数量
		let allprice=0;//总共个花费
		let singlePrice=[0];//最贵的商品单价 数组   空数组里面取不出最大值，所以放个0
		//上部分循环渲染
		let stra="";
		data.forEach(item=>{
			let {id,count,price}=item;
			stra+=`<div class="item" data-id="${id}">
						<img src="./img/add.png" alt="" class="add">
						<span>${count}</span>
						<img src="./img/sub.png" alt="" class="sub">
						<p>单价：${price}元 小计：${count*price}元</p>
					</div>`
			allcount+=count;
			allprice+=count*price;		
		    if(count>0){
				singlePrice.push(price);//[12.5,10.5]
			}
		})
		box_top.innerHTML=stra;
		
		//下部分渲染
		let strb=`<p>商品合计：<span>${allcount}</span> 件</p>
				<p>共花费了：<span>${allprice}</span> 元</p>
				<p>其中最贵的商品单价是：<span>${Math.max(...singlePrice)}</span> 元</p>`;
		box_bottom.innerHTML=strb;
		
	}
	//功能部分
	function handle(){
		//需要找到所有的加减按钮，每一个按钮都必须绑定事件，
		//绑定的事件越多效率就会越低下
		//直接查找按钮元素，无法找到，必须渲染完才能找到
		
		//事件委托：绑定事件委托给 祖先级元素
		box_top.onclick=function(e){//e:event 事件对象
			// console.log(e.target);//触发事件的元素
			// console.log(e.target.className);//触发事件的元素 class名称
			// console.log(e.target.tagName);//触发事件的元素 标签名 必须大写
			
			//找到点击加或者减 的那行 id  
			let aid=e.target.parentNode.getAttribute("data-id");
			console.log(aid);
			//通过id 查找出数据中的那项
			let item=data.find(item => item.id==aid);
			
			if(e.target.tagName=="IMG"){//加 减
				if(e.target.className=="add"){//加
					item.count++;
				}else{//减
					if(item.count<=0){
						item.count=0;
						return;
					}
					item.count--;
				}
			}
			
			render();//重新渲染
			
		}
		
	}
	
	return {
		init(){//初始化函数
			getData()
			render()
			handle()
		}
	}
})()

product.init();//调用初始化函数