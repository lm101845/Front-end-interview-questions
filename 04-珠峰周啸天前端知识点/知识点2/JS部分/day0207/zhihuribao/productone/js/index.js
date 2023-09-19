$(function(){
	//补零函数
	const addZero=function addZero(n){
		return n>=10?n:"0"+n;
	}
	//处理导航栏数据
	const getheader=function getheader(){
		let date=new Date();
		let day=date.getDate();//获取日
		let month=date.getMonth();//获取月 7
		let montharr=["一月","二月","三月","四月","五月",
		              "六月","七月","八月","九月","十月","十一月","十二月"];
		$(".letext span").html(addZero(day));
		$(".letext p").html(montharr[month]);
		
		let hour=date.getHours();
		if(hour>=12){
			$(".header_left h1").html("知乎日报");
		}else{
			$(".header_left h1").html("早上好！");
	    }
	}
	getheader();
	
	//轮播图处理
	//通过jq ajax 获取的数据，只能在回调函数里用，因为是异步的
	//1.获取轮播图数据
	$.get("http://localhost:8888/api/swiper",function(data){
		//console.log(data);
		lunrender(data);
	})
	//2.循环渲染页面
	function lunrender(data){
		let str="";
		data.forEach(item=>{
			let {author,id,img,title}=item;
			str+=`<div class="swiper-slide" data-id="${id}">
					<img src="${img}" alt="">
					<di v class="swiperText">
						<h1>${title}</h1>
						<p>${author}</p>
					</div>
				</div>`
		})
		$(".swiper-wrapper").html(str);//必须先渲染完，再启动轮播图
		startlun();//启动轮播图
	}
   //启动轮播图
   function startlun(){
	   var swiper = new Swiper(".mySwiper", {
	   	pagination: {
	   		el: ".swiper-pagination",
	   	},
	   	autoplay: {
	   		delay: 1000,
	   		stopOnLastSlide: false,
	   		disableOnInteraction: true,
	   	},
	   	loop: true,
	   });
   }
   
   //列表数据的循环和渲染
   let str="",i=-1,num=0;
   //获取时间的方法
   function getDate(i){
   	let date=new Date()-(i*24*60*60*1000);//时间戳
	let newdate=new Date(date);
   	let day=newdate.getDate();//获取日
   	let month=newdate.getMonth()+1;//获取月
   	return {
		day:addZero(day),
		month
	}
   }
   
   function getlist(){
	   $.get("http://localhost:8888/api/articleList?date=2021-05-21",function(data){
	   	   //console.log(data);
	   	   listrender(data);
	   })
   }  
   getlist();
 
   //渲染
   function listrender(data){
	   i++;//0 1 2
	   if(i>0){
		  let {day,month}=getDate(i);
		  str+=`<p>${month}月${day}日<span></span></p>`
	   }
	   data.forEach(item=>{
		   let {author,des,id,img,title}=item;
		   str+=`<div class="item" data-id="${id}">
					<div class="item_left">
						<h1>${title}</h1>
						<span>${author}·${des}分钟阅读</span>
					</div>
					<img src="${img}" alt="">
				</div> `
	   })
	   $(".list").html(str);
   }
   //触底加载更多
   let ob=new IntersectionObserver(changes=>{
	  if(changes[0].isIntersecting){
		  //加载更多
		   num++;
		   if(num>=5){
			   $(".loadmore").html("加载已完成");//加载更多变成加载完成
			   ob.unobserve($(".loadmore")[0]);//取消监控
			   return;//不能加载更多
		   }
		   getlist();
	  }
   })
   
   ob.observe($(".loadmore")[0])//监控的是DOM对象 现将jquery对象转换为DOM对象

   //跳转到详情页
   //循环上去的数据，直接绑定事件，有可能绑定不上去----解决：事件委托
   //绑定不上去
   //jquery 事件委托 delegate
   $(".list").delegate(".item","click",function(){
	  //console.log(this);
	  let aid=$(this).attr("data-id");
	 location.href="./pages/info.html?id="+aid;
   })
   
   //跳转到登录页面
   $("#touxiang").click(function(){
	location.href="./pages/login.html";
   })
})