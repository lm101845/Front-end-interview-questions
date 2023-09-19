(function(){
	let bannerBox=document.getElementById("bannerBox");
	let wrapper=document.querySelector(".wrapper"),
	pagination=document.querySelector(".pagination");
	let slides=null,paginationlist=null;
	let data=[];
	
	let step=0;
	let count=0;
	let timer=null;
	let getdata=function getdata(){
		var xhr=new XMLHttpRequest;
		xhr.open("GET","./data.json",false);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4&&xhr.status==200){
				data=JSON.parse(xhr.responseText);
			}
		}
		xhr.send(null);
	}
	let binding=function binding(){
		let stra="",strb="";
		data.forEach((item,index)=>{
			stra+=`<div  class="${index==0?'slide active':'slide'}"><img src="${item.pic}" alt=""></div>`;
			strb+=`<span index="${index}" class="${index==0?'active':''}"></span>`;
		})
		wrapper.innerHTML=stra;
		pagination.innerHTML=strb;
		count=data.length;
		paginationlist=document.querySelectorAll(".pagination span");
		slides=document.querySelectorAll(".wrapper .slide");
	}
	//自动轮播
	let autoplay=function autoplay(){
		step++;
		if(step>count-1){
			step=0;
		}
		toggleimg(step);
	}
	//切换图片 和 小圆点
	let toggleimg=function toggleimg(step){
		slides.forEach((item,index)=>{
			if(index==step){
				item.className="slide active";
			}else{
				item.className="slide";
			}
		})
		paginationfocus(step);
	}

    //分页器切换效果
    let paginationfocus=function paginationfocus(step){
    	paginationlist.forEach((item,index)=>{
    		if(index===step){
    			item.className="active";
    			return;
    		}
    		item.className="";
    	})
    }
	
	bannerBox.onmouseenter=()=>{
		clearInterval(timer);
		timer=null;
	}
	bannerBox.onmouseleave=()=>timer=setInterval(autoplay,3000);
	
	//左右按钮点击 和 分页器点击
	bannerBox.onclick=function(e){
		let target=e.target;
		let TagName=target.tagName;
		let cName=target.className;
		if(TagName==="SPAN"){//分页器
		    let index=+target.getAttribute("index");
			toggleimg(index);
			return;
		}
		if(TagName==="DIV"&&cName.includes("navigation")){
			 if(cName.includes("prev")){//左按钮
				 step--;
				 if(step<0){
					step=count-1;
				 }
				 toggleimg(step);
			 }else{
				 //右按钮，跟自动轮播一样
				 autoplay()
			 }
			
		}
	}
	
	getdata();
	binding();
	timer=setInterval(autoplay,3000);
	
})()