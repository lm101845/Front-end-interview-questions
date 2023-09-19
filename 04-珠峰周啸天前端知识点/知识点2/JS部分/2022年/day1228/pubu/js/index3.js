let product=(function(){
	let data=null;
	let cloumns=Array.from(document.querySelectorAll(".cloumn"));
	let imgbox=null;
	let loadmorebox=document.getElementById("loadmorebox");
	//1.获取数据
	function getData(){
		let xhr=new XMLHttpRequest;
		xhr.open("GET","data.json",false);
		xhr.onreadystatechange=function(){
			if(xhr.readyState===4&&xhr.status===200){
				data=JSON.parse(xhr.response);
			}
		}
		xhr.send(null);
	}
	//2.循环渲染
	function render(){
		//2.1 统一进行数据处理，改变高宽
		newdata=data.map(item=>{
			let {height,width}=item;
			item.width=230;
			item.height=230*height/width;
			return item;
		})
		
		//2.2
		let groups=[],i;
		for(i=0;i<newdata.length;i+=3){//[0,1,2]  [3,4,5]  [6,7,8]
			//i=0 [0,1,2]  3
			//i=3 [3,4,5]  6
			//i=6 [6,7,8]  9
			groups=newdata.slice(i,i+3);
			//每三组数据，[小 中 大] 排序 height
			groups.sort((a,b)=>{
				return a.height-b.height;
			})
			//每三列数据，[大 中 小] 排序 offsetHeight
			cloumns.sort((a,b)=>{
				return b.offsetHeight-a.offsetHeight
			})
			
			groups.forEach((item,index)=>{
				let {id,pic,width,height,title,link}=item;
				
				let str=`<div class="item" data-id="${id}">
					<a href="${link}">
						<div class="imgbox" style="height:${height}px;width:${width}px">
							<img src="" data-src="${pic}" style="height:${height}px;width:${width}px">
						</div>
						<p>${title}</p>
					</a>	
				</div>`
				
				cloumns[index].innerHTML += str;
			})
		}
	    
		//循环渲染结束后找盒子
	    imgbox=Array.from(document.querySelectorAll(".imgbox"));
	}
	function loadimg(img){
		let dataSrc=img.getAttribute("data-src");
		let newimg=new Image;
		newimg.src=dataSrc;
		newimg.onload=function(){
			img.src=dataSrc;
			newimg=null;
			img.flag=true;
		}
	}
	//3.功能部分 瀑布流
	function handle(){//监听器
	    //创建 监听器
		let ob=new IntersectionObserver(changes=>{
			changes.forEach(change=>{
				if(change.isIntersecting){//加载图片
					//change  有个target属性，具体监控的元素
					let imagebox=change.target;
					let img=imagebox.querySelector("img");
					if(img.flag){
						ob.unobserve(imagebox);
						return;
					}
					loadimg(img);
				}
			})
		},{
			threshold:[1]
		})
		
		//循环51个盒子
		imgbox.forEach(item=>{
			//用 observe 来监监控盒子，是否在视窗出现
			ob.observe(item)
		})
	}
	let count=0;
	function loadmore(){
		let ob2=new IntersectionObserver(changes=>{
			if(changes[0].isIntersecting){//加载更多
			    count++;
				if(count>2){
					ob2.unobserve(loadmorebox);
					loadmorebox.innerHTML="加载已完成"
					return;
				}
				getData()
				render()
				handle()
			}
		})
		ob2.observe(loadmorebox)
	}
	return {
		init(){
			getData()
			render()
			handle()
			loadmore()
		}
	}
})()

product.init()
