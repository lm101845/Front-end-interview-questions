(function(){
	let leftbox=document.querySelector(".boxleft");
	let mark=document.querySelector(".mark");
	let rightbox=document.querySelector(".boxright");
	let bigimg=document.querySelector(".bigimg");
	
	let leftw=leftbox.offsetWidth;//左侧盒子的宽度
	let lefth=leftbox.offsetHeight;//左侧盒子的高度
	
	function getwh(ele,attr){
		return parseInt(window.getComputedStyle(ele)[attr]);
	}
	
	//offsetWidth隐藏的元素，求不出来高度和宽度
	//用getComputedStyle() 隐藏元素的样式属性
	let markw=getwh(mark,"width");//遮罩层的宽度
    let markh=getwh(mark,"height");//遮罩层的高度
	
	let rightw=getwh(rightbox,"width");//右侧盒子的宽度
	let righth=getwh(rightbox,"height");//右侧盒子的高度
	
	bigimg.style.width=(rightw/markw*leftw)+"px";
	bigimg.style.height=(righth/markh*lefth)+"px";
	
	//移入左侧盒子，遮罩层和右侧盒子显示
	leftbox.onmouseenter=function(){
		mark.style.display="block";
		rightbox.style.display="block";
	}
	
	//移出左侧盒子， 遮罩层和右侧盒子隐藏
	leftbox.onmouseleave=function(){
		mark.style.display="none";
		rightbox.style.display="none";
	}
	
	let  t=leftbox.offsetTop;
	let  l=leftbox.offsetLeft;
	
	//最大移动范围
	let maxW=leftw-markw;
	let maxh=lefth-markh;
	
	leftbox.onmousemove=function(e){
		console.log(e.target);
		let px=e.pageX;
		let py=e.pageY;
		
		let resultX=px-l-(markw/2);
		let resultY=py-t-(markh/2);
		
		resultX=resultX<=0?0:(resultX>=maxW?maxW:resultX);
		resultY=resultY<=0?0:(resultY>=maxh?maxh:resultY);
		
		//遮罩层的坐标位置
		mark.style.left=resultX+"px";
		mark.style.top=resultY+"px";
		
		//大图片的坐标位置
		bigimg.style.left="-"+(rightw/markw*resultX)+"px";
		bigimg.style.top="-"+(righth/markh*resultY)+"px"
	}
})()