(function () {
	//找到整个图片的盒子，来移动
	let wrapper = document.querySelector(".wrapper");
	//bannerBox跟图片的宽度一样
	let bannerBox = document.getElementById("bannerBox");
	let spanlist = null;
	let pagination=document.querySelector(".pagination");
	//求图片宽度
	let w = bannerBox.offsetWidth;
	let step = 0;
	let count = 0;//图片个数
	var timer = null;
    
	//获取数据+循环渲染
    function render(){
	   let data=null;
      //1.获取数据
	  let xhr=new XMLHttpRequest;
	  xhr.open("GET","data.json",false);
	  xhr.onreadystatechange=function(){
		if(xhr.readyState===4&&xhr.status===200){
			data=JSON.parse(xhr.response);
			console.log(data);
		}
	  }
	  xhr.send(null);

	  //2.循环渲染
	  let strWrapper="";
	  let strPag="";
	  data.forEach((item,index)=>{
         let {pic}=item;
		 strWrapper+=`<div class="slide"><img src="${pic}" alt=""></div>`;
		 strPag+=`<span class="${index==0?'active':''}" index="${index}"></span>`
	  })
      //重复第一张图片
	  strWrapper+=`<div class="slide"><img src="${data[0].pic}" alt=""></div>`;
     
	  wrapper.innerHTML=strWrapper;
	  pagination.innerHTML=strPag;
      
	  //修改部分初始值
	  count=data.length+1;
	  spanlist = Array.from(document.querySelectorAll(".pagination span"));
	}
	render();


	//焦点切换
	function pagActive() {
		// temp step 0，1，2，3
		let temp = step;
		//temp 3--->0
		if (temp == count - 1) {//0，1，2，0
			temp = 0
		}
		spanlist.forEach((item, index) => {//index 0,1,2
			if (index == temp) {//0--0 1--1  2--2
				item.className = "active";
			} else {
				item.className = "";
			}
		})
	}

	function autoplay() {
		step++;
		if (step > count - 1) {
			wrapper.style.transitionDuration = "0s";//停止动画
			wrapper.style.left = "0px";//最后一幅立刻回到第一幅图
			wrapper.offsetWidth;//注意：先刷新一次队列
			step = 1;//接下来要进入第二幅图
			wrapper.style.transitionDuration = "0.3s";//重新开启动画
		}
		wrapper.style.left = `-${step * w}px`;
		pagActive();//焦点
	}

	//左右按钮+焦点
	bannerBox.onclick = function (e) {
		//点击焦点---》显示对应图片
		if (e.target.tagName == "SPAN") {
			let index=e.target.getAttribute("index");
			//注意如果 点击的刚好是焦点元素，不同做操作了
			//特殊注意：如果index--0  step:0或者3  0-3
			//index==step  0-0  1-1  2-2
			//(index==0&&step==count-1) 0-3  
			if(index==step||(index==0&&step==count-1)){
				return;
			}
			step=index;
			wrapper.style.left=`-${step*w}px`;
			pagActive();
		}

		//左右按钮
		if (e.target.className.includes("navigation")) {
			if (e.target.className.includes("prev")) {
				step--;
				if (step < 0) {
					wrapper.style.transitionDuration = "0s";//停止动画
					wrapper.style.left = `-${(count - 1) * w}px`//count-1 3
					wrapper.offsetWidth;//注意：先刷新一次队列
					step = count - 2;//count-2   2
					wrapper.style.transitionDuration = "0.3s";//重新开启动画
				}
				wrapper.style.left = `-${step * w}px`;
				pagActive();//焦点
			} else {
				autoplay();
			}
		}
	}

	//打开页面就启动动画
	timer = setInterval(autoplay, 1000)

	//移入停止动画
	bannerBox.onmouseenter = function () {
		clearInterval(timer);
		timer = null;
	}

	//移出重新启动动画
	bannerBox.onmouseleave = function () {
		timer = setInterval(autoplay, 1000)
	}

})()

