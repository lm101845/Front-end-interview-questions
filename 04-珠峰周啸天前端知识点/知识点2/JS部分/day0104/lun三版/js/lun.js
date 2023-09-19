(function(){
	let wrapper=document.querySelector(".wrapper");
	let bannerBox=document.getElementById("bannerBox");
	let count=4;//图片的个数
	let timer=null;//定时器
	let w=bannerBox.offsetWidth;//每次图片移动的宽度
	let step=0;
	let paginationlist=null;
	let pagination=document.querySelector(".pagination");
	
	function render(){
		let data=[];
		let xhr=new XMLHttpRequest;
		xhr.open("GET","./data.json",false);
		xhr.onreadystatechange=function(){
			if(xhr.readyState===4&&xhr.status===200){
				data=JSON.parse(xhr.responseText);
			}
		}
		xhr.send(null);
		console.log(data);
		let stra="";
		let strb="";
		data.forEach((item,index)=>{
			let {pic}=item;
			stra+=`<div class="slide"><img src="${pic}" alt=""></div>`;
			strb+=`<span class="${index==0?'active':''}" index="${index}"></span>`;
		})
		stra+=`<div class="slide"><img src="${data[0].pic}" alt=""></div>`;
		wrapper.innerHTML=stra;
		pagination.innerHTML=strb;
		count=data.length+1;
		paginationlist=document.querySelectorAll(".pagination span");
	}
	render();
	
	//自动轮播
	function autoPlay(){
		step++;
		if(step>count-1){
			wrapper.style.transitionDuration="0s";
			wrapper.style.left=`0px`;
			step=1;
			wrapper.offsetWidth;
		}
		wrapper.style.transitionDuration="0.3s";
		wrapper.style.left=`-${step*w}px`;
		paginationfocus();
	}
	//小圆点获取焦点
	function paginationfocus(){
		let temp=step;
		if(temp===count-1){
			temp=0;
		}
		paginationlist.forEach((item,index)=>{
			if(index===temp){
				item.className="active";
				return;
			}
			item.className="";
		})
	}
	//添加点击功能
	bannerBox.onclick=function(e){
		let tar=e.target;
		let cName=tar.className;
		let tagN=tar.tagName;
		if(tagN==="SPAN"){
			//console.log("小圆点");
			let num=+tar.getAttribute("index");
			//if(step===num||(step===count-1&&num===0)) return;
			step=num;
			wrapper.style.left=`-${num*w}px`;
			paginationfocus()
			return;
		}
		if(tagN==="DIV"&&cName.includes("navigation")){
			if(cName.includes("prev")){//左
				step--;
				if(step<0){
					wrapper.style.transitionDuration="0s";
					wrapper.style.left=`-${(count-1)*w}px`;
					step=count-2;
					wrapper.offsetWidth;
				}
				wrapper.style.transitionDuration="0.3s";
				wrapper.style.left=`-${step*w}px`;
				paginationfocus();
			}else{
				autoPlay();
			}
		}
	}
	//自动轮播启动
	timer=setInterval(autoPlay,1000);//启动定时器
    bannerBox.onmouseenter=function(){
		clearInterval(timer);
		timer=null;
	}
	bannerBox.onmouseleave=function(){
		timer=setInterval(autoPlay,1000);
	}
	
})()