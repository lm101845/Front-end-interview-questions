let product=(function(){
	let data=null;
	//cloumns 是类数组集合，不能用sort，先转为数组
	let cloumns=Array.from(document.querySelectorAll(".cloumn"));
	let imgbox=null;
	let html=document.documentElement||document.body;
	// 工具类方法：函数节流处理
	function throttle(func, wait) {
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
		//1.页面和数据不匹配，先对数据进行统一处理
		let newData=data.map((item)=>{
			let {height,width}=item;// height:433 width:300
			item.width=230;//修改item 的宽度
			item.height=230*height/width;//修改item 的高度
			return item;
		})
		
		let groups=[],i;
		for(i=0;i<newData.length;i+=3){//i=0,3,6,9....
		   //i=0 [0,1,2]  //i=0  i=3  [0,1,2]
		   //i=3 [3,4,5]  //i=3  i=6  [3,4,5]
			groups=newData.slice(i,i+3);
			//groups按照height(数值)排序 【小中大】
			groups.sort((a,b)=>{
				return a.height-b.height;
			})
			
			//列排序  根据整个列所求高（offsetHeight）【大中小】
			cloumns.sort((a,b)=>{
				return b.offsetHeight-a.offsetHeight;
			})
			
			groups.forEach((item,index)=>{//0---0
				let {id,height,width,pic,title,link}=item;
				let str=`<div class="item" data-id="${id}">
					<a href="${link}">
						<div class="imgbox" style="height:${height}px;width:${width}px;">
							<img src="" data-src="${pic}" alt="" style="height:${height}px;width:${width}px;">
						</div>
						<p>${title}</p>
					</a>	
				</div>`
				cloumns[index].innerHTML += str;
			})
		}
		
		//1. 渲染之后才能找占位盒  2. forEach 要将类数组---》数组
		imgbox=Array.from(document.querySelectorAll(".imgbox"));
	}
	//图片懒加载
	function loadimg(img){
		let dataSrc=img.getAttribute("data-src");
		let newimg=new Image;
		newimg.src=dataSrc;
		newimg.onload=function(){
			img.src=dataSrc;
			newimg=null;
			//先不删除 data-src，后面用到
			img.flag=true;
		}
	}
	//功能
	function handle(){
		let ch=html.clientHeight;
		imgbox.forEach(item=>{
			let toToph=item.getBoundingClientRect().bottom;
			if(ch>=toToph){//图片懒加载
	            //通过占位盒，找到图片（占位盒下面的图片）
				let img=item.querySelector("img");
				if(img.flag){return}
				loadimg(img);
			}
		})
	}
	//触底加载更多
	let count=0;
	function loadmore(){
		let lefth=html.scrollHeight;
		let righth=html.clientHeight+html.scrollTop;
		//提早差不多 50 加载更多
		if(righth+50>=lefth){
			count++;
			if(count>2){
				return;
			}
			getData()
			render()
			handle()
		}
	}
	return {
		init(){
			getData()
			render()
			handle()//一打开页面，先观察一次
			//节流+瀑布流
			window.onscroll=throttle(function(){//滚动的时候再观察
			   console.log("1111");
				handle()
				loadmore()
			},500)
		}
	}
})()

product.init()
