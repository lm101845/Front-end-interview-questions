(function(){
	let bannerBox=document.getElementById("bannerBox");
	let wrapper=document.querySelector(".wrapper");
	let pagination=document.querySelector(".pagination");
	let w=bannerBox.offsetWidth;//每个图片宽度
	let step=0;//自定义的步长0
	let timer=null;
	let count=4;//总的图片个数
	let spanlist=null;//所有小圆点
	
	//获取数据并且渲染
	function render(){
		//获取数据
		let data=null;
		let xhr=new XMLHttpRequest();
		xhr.open("GET","data.json",false);
		xhr.onreadystatechange=function(){
			if(xhr.readyState===4&&xhr.status===200){
				data=JSON.parse(xhr.response);
			}
		}
		xhr.send(null);
		
		//循环渲染
		let strimg="",strscricle="";
		data.forEach((item,index)=>{
			let {pic}=item;
			strimg+=`<div class="slide"><img src="${pic}" alt=""></div>`;//循环5个图片
			strscricle+=`<span class="${index==0?'active':''}" index="${index}"></span>`//循环5个小圆点
		})
		strimg+=`<div class="slide"><img src="${data[0].pic}" alt=""></div>`;//重复第一幅图片
		
		wrapper.innerHTML=strimg;//把图片放入到 wrapper 里
		pagination.innerHTML=strscricle;//把圆点放入到 pagination 里
		spanlist=Array.from(document.querySelectorAll("span"));//渲染完后找所有小圆点
		count=data.length+1;//修改图片总个数
	}
	render();
	
	//自动轮播
	function autoplay(){
		step++;
		if(step>count-1){
			wrapper.style.transitionDuration="0s";//立刻停止动画
			wrapper.style.left="0";//立刻回到第一幅图  0
			wrapper.offsetWidth;//获取样式 渲染一次队列
			step=1;//将由第一幅图滑到第二幅图   -1000
			wrapper.style.transitionDuration="0.3s";//重新开启动画
		}
		
		wrapper.style.left=`-${w*step}px`;
		criclefocus();//小圆点获取焦点
	}
	timer=setInterval(autoplay,1000);
	
	//小圆点获取焦点
	function criclefocus(){
		let temp=step;//0,1,2,3
		if(temp==count-1){
			temp=0;//0，1，2，0
		}
		spanlist.forEach((item,index)=>{//index 0,1,2
			if(index==temp){
				item.className="active";
			}else{
				item.className="";
			}
		})
	}
	
	//小圆点 左右按钮添加点击事件---》事件委托
	bannerBox.onclick=function(e){
		let tar=e.target;
		if(tar.tagName==="SPAN"){//小圆点
			//console.log("小圆点");
			let index=+e.target.getAttribute("index");//获取 index--0,1,2
			if(index==step||(index==0&&step==count-1)){//0-0 1-1 2-2 0(index)-3(step)
				return;
			}
			step=index;//让 step等于index
			wrapper.style.left=`-${w*step}px`;//显示点击的图片
			criclefocus();//显示点击的小圆点
		}
		
		if(tar.tagName==="DIV"&&tar.className.includes("navigation")){//左右按钮
			if(tar.className.includes("prev")){//左
				step--;
				if(step<0){
					wrapper.style.transitionDuration="0s";
					wrapper.style.left=`-${w*(count-1)}px`;
					wrapper.offsetHeight;
					step=count-2;
					wrapper.style.transitionDuration="0.3s";
				}
				
				wrapper.style.left=`-${w*step}px`;
				criclefocus();
			}else{//右
				//console.log("右");
				autoplay();
			}
		}
	}

	//进入bannerBox，停止轮播图
	bannerBox.onmouseenter=function(){
		clearInterval(timer);
		timer=null;
	}
	//离开bannerBox，重新开始轮播
	bannerBox.onmouseleave=function(){
		timer=setInterval(autoplay,1000);
	}
})()