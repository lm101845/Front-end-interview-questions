(function(){
	let container = document.querySelector('#container');
	let wrapper=container.querySelector(".container .wrapper");
	let slides=null;
	let data=[];
	let navPrev = container.querySelector('.navigation.prev'),
	navNext = container.querySelector('.navigation.next');
	
	let step=0;//默认刚开始显示第一张
	let count=0;// 默认图片数量为0
	let timer=null;
	//获取数据
	let getdata=function getdata(){
		var xhr=new XMLHttpRequest;
		xhr.open("GET","./3d/data.json",false);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4&&xhr.status==200){
				data=JSON.parse(xhr.responseText);
			}
		}
		xhr.send(null);
	}
	//页面初始化加载
	let binding=function binding(flag){
		//1.刚开始判断一下图片的数据是否能超过5张，超不过就给补充
		if (data.length === 0) return;
        while (data.length < 5) {
            let diff = 5 - data.length,
                clone = data.slice(0, diff);
            data = data.concat(clone);
        }
        count = data.length;
		//2. 先给data数据做一下处理，
		//给每条数据增添一个 className, z-index translate scale 
		let temp1=step-2;
		let temp2=step-1;
		let temp3=step;//正中间这一项
		let temp4=step+1;
		let temp5=step+2;
		//假设 step 为 0
		if(temp1<0){temp1=count+temp1;}
		if(temp2<0){temp2=count+temp2;}
		//假设 step 为最大值
		if(temp4>count-1){temp4=temp4 - count;}
		if(temp5>count-1){temp5=temp5 - count;}
		
		data=data.map((item,index)=>{
			let className="slide";
			let zindex=0;
			let transform="translate(-50%,-50%) scale(0.55)";
			switch (index){
				case temp1:
					zindex=1;
					transform="translate(-195%,-50%) scale(0.7)";
					break;
				case temp2:
					zindex=2;
					transform="translate(-130%,-50%) scale(0.85)";
					break;
				case temp3:
					className="slide active";
					zindex=3;
					transform="translate(-50%,-50%) scale(1)";
					break;
				case temp4:
					zindex=2;
					transform="translate(30%,-50%) scale(0.85)";
					break;
				case temp5:
					zindex=1;
					transform = 'translate(95%,-50%) scale(0.7)';
					break;
			}
			item.className=className;
			item.sty=`z-index:${zindex};transform:${transform};`;
			return item;
		})
		//5.自动轮播，如果不是第一次，只需要修改样式就是，不需要重新渲染
		if(!flag){
			data.forEach((item,index)=>{
				let {className,sty}=item;
				slides[index].className=className;
				slides[index].style.cssText=sty;
			})
			return;
		}
		
		//3. 数据处理好后，将数据循环到页面上
		let str="";
		data.forEach((item)=>{
			let {
				className,sty,pic,descript
			}=item;
			str+=`<div class="${className}" style="${sty}">
								<img src="${pic}" alt="">
								<div class="mark"></div>
								<div class="desc">
									<p>${descript.name}</p>
									<p>${descript.identity}</p>
									<p>${descript.dream}</p>
								</div>
							</div> `;
		})
		wrapper.innerHTML=str;
		
		//4.获取slides
		slides=wrapper.querySelectorAll(".slide");
	}
	//自动轮播
	let autoplay=function autoplay(){
		step++;
		if(step>=count){
			step=0;
		}
		binding();
	}
	
	//鼠标滑过自动轮播
	container.addEventListener("mouseenter",()=>{
		clearInterval(timer);
		timer=null;
	})
	container.addEventListener("mouseleave",()=>{
		timer=setInterval(autoplay,1000)
	})
	
	//左右点击按钮切换图片
	container.addEventListener("click",function(e){
		let target=e.target;
		let tagName=target.tagName;
		let classN=target.className;
		if(tagName=="DIV"&&classN.includes("navigation")){
			if(classN.includes("prev")){//左
				step--;
				if(step<0){
					step=count-1;
				}
				binding();
			}else{//右
				autoplay()
			}
		}
	})
	

	getdata();
	binding(true);
	timer=setInterval(autoplay,1000)
	
})()