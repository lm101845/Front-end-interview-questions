(function(){
	let bannerBox=document.getElementById("bannerBox");
	let wrapper=document.querySelector(".wrapper");
	let paginationlist=document.querySelectorAll(".pagination span");
	let w=bannerBox.offsetWidth;
	let step=0;
	let count=4;
	let timer=null;
	//自动轮播；
	let autoplay=function autoplay(){
		step++;
		if(step>count-1){
			wrapper.style.transitionDuration="0s";
			wrapper.style.left="0px";
			step=1;
			wrapper.offsetWidth;
		}
		wrapper.style.transitionDuration="0.3s";
		wrapper.style.left=`${-step*w}px`;
		paginationfocus();
	}
	//分页器切换效果
	let paginationfocus=function paginationfocus(){
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
	//左右按钮点击 和 分页器点击
	bannerBox.onclick=function(e){
		let target=e.target;
		let TagName=target.tagName;
		let cName=target.className;
		if(TagName==="SPAN"){//分页器
		    let index=+target.getAttribute("index");
			if(index===step||(step===count-1&&index===0)) return;
			step=index;
			wrapper.style.left=`${-index*w}px`;
			paginationfocus();
			return;
		}
		if(TagName==="DIV"&&cName.includes("navigation")){
			 if(cName.includes("prev")){//左按钮
				 step--;
				 if(step<0){
					wrapper.style.transitionDuration="0s";
					wrapper.style.left=`${-(count-1)*w}px`;
					step=count-2;
					wrapper.offsetWidth;
				 }
				 wrapper.style.transitionDuration="0.3s";
				 wrapper.style.left=`${-step*w}px`;
				 paginationfocus();
			 }else{
				 //右按钮，跟自动轮播一样
				 autoplay()
			 }
			
		}
	}
	timer=setInterval(autoplay,1000);
	bannerBox.onmouseenter=()=>{
		clearInterval(timer);
		timer=null;
	}
	bannerBox.onmouseleave=()=>timer=setInterval(autoplay,1000);
	
})()