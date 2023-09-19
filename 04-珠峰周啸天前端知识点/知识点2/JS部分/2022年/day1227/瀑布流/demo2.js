let fallsModule=(function(){
	let data=[];
	let columns=Array.from(document.querySelectorAll(".column"));
	let imglist=[];
	// 工具类方法：函数节流处理 
	    const throttle = function throttle(func, wait) {
	        if (typeof func !== "function") throw new TypeError('func must be an function');
	        if (typeof wait !== "number") wait = 300;
	        let timer,
	            previous = 0;
	        return function proxy(...params) {
	            let now = +new Date(),
	                remaining = wait - (now - previous),
	                self = this,
	                result;
	            if (remaining <= 0) {
	                if (timer) {
	                    clearTimeout(timer);
	                    timer = null;
	                }
	                result = func.call(self, ...params);
	                previous = now;
	            } else if (!timer) {
	                timer = setTimeout(() => {
	                    if (timer) {
	                        clearTimeout(timer);
	                        timer = null;
	                    }
	                    result = func.call(self, ...params);
	                    previous = +new Date();
	                }, remaining);
	            }
	            return result;
	        };
	    };
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
			//获取图片底部 距离 可视区域顶部的距离
			let A=imgBox.getBoundingClientRect().bottom;
			//获取可视区域的高度
			let B=HTML.clientHeight;
			if(A<=B){
				lazyloadimg(item);
			}
		})
	}
	//加载更多
	let count=0;
	const loadmore=function loadmore(){
		//判断：整个容器的高度 = 滚动的高度+可视区域的高度 就是到达顶部
		//  滚动的高度+可视区域的高度+100 大于等于  整个容器的高度
		let HTML=document.documentElement||document.body;
		if(HTML.scrollTop+HTML.clientHeight+100>=HTML.scrollHeight){
			count++;
			if(count>3)return;
			getData();
			binding();
			lazyloadimgs();
		}
	}
	return {
		init(){
			getData();
			binding();
			lazyloadimgs();
			// window.onscroll=function(){
			// 	lazyloadimgs();
			// }
			//window.onscroll=throttle(lazyloadimgs,500);
			window.onscroll=throttle(function(){
				lazyloadimgs();
				loadmore();
			},500);
		}
	}
})();
fallsModule.init();