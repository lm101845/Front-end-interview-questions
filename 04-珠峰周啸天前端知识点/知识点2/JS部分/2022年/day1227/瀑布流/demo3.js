let fallsModule=(function(){
	let data=[];
	let columns=Array.from(document.querySelectorAll(".column"));
	let imglist=[];
	let loadmorebox=document.querySelector(".loadmore");
    //创建一个监听器
	let ob=new IntersectionObserver(changes=>{
		changes.forEach(change=>{
			let {isIntersecting,target}=change;
			if(isIntersecting){
				lazyloadimg(target.querySelector('img'));
				ob.unobserve(target);
			}
		})
		
	},{
		threshold:[1]
	})
	//ajax 获取数据
	const getData=function getData(){
		let xhr=new XMLHttpRequest;
		xhr.open("GET","./data.json",false);
		xhr.onreadystatechange=()=>{
			if(xhr.readyState===4 && xhr.status===200){
				data=JSON.parse(xhr.responseText);
			}
		}
		xhr.send(null);
	}
	//渲染页面
	const binding=function binding(){
		//1. 现将获取来的图片的高度和宽度进行处理一下
		data=data.map((item)=>{
			let {height,width}=item;
			item.width = 230;
			item.height = 230 / (width / height);
			return item;
		})
		//刚开始每一列都放一张图片----》最后要保证图片高度几乎一致
		//后面的图片要根据[小，中，大]排列--->group
		//每列的高度要根据[大，中，小]排列  要保证总高度差值几乎一样
		let i=0,group;
		for(;i<data.length;i+=3){
			//3个为一组获取
			group = data.slice(i, i + 3);
			group.sort((a, b) => a.height - b.height);
			columns.sort((a, b) => b.offsetHeight - a.offsetHeight);
			
			group.forEach((item,index)=>{
				let {id,pic,width,height,title,link}=item;
				let box=document.createElement("div");
				box.className="item";
				box.innerHTML=`<a href="${link}">
					<div class="con_img" style="height:${height}px;" >
						<img src="" alt="" data-src="${pic}">
					</div>
					<div class="con">
					   ${title}
					</div>`;
				columns[index].appendChild(box);
			})
		}
		//图片加载完获取所有的图片
		imglist=Array.from(document.querySelectorAll(".con_img img"));
	}
	//单个懒加载图片
	const lazyloadimg=function lazyloadimg(img){
		let pic=img.getAttribute("data-src");
		let tempimg=new Image;
		tempimg.src=pic;
		tempimg.onload=function(){
			img.src=pic;
			img.style.opacity=1;
		}
		img.isLoad=true;
	}
	//多个图片懒加载
	const lazyloadimgs=function lazyloadimgs(){
		let HTML=document.documentElement||document.body;
		imglist.forEach((item)=>{
			if(item.isLoad) return;
			let imgBox = item.parentNode;
			ob.observe(imgBox);
		})
	}
	//加载更多
	const loadmore=function loadmore(){
		let count=0;
		let ob2=new IntersectionObserver(changes=>{
			let {isIntersecting}=changes[0];
			if(isIntersecting){
				count++;
				if(count>3){
					ob2.unobserve(loadmorebox);
					return;
				}
				getData();
				binding();
				lazyloadimgs();
			}
		})
		ob2.observe(loadmorebox);
	}
	return {
		init(){
			getData();
			binding();
			lazyloadimgs();
			loadmore();
		}
	}
})();
fallsModule.init();