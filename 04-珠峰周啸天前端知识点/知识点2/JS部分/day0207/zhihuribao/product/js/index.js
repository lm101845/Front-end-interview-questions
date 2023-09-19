$(function(){
  //补零函数
  function addZero(n){
      return n>9?n:"0"+n;
  }
  //获取日期
  function getDate(){
      let date=new Date();
      let month=date.getMonth();//2
      let day=date.getDate();
      let montharr=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
      $(".time h2").html(addZero(day));
      $(".time p").html(montharr[month]);

      let hour=date.getHours();
      if(hour>=12){
         $(".h_left h1").html("知乎日报");
      }else{
         $(".h_left h1").html("早上好");
      }
  }
  getDate()

  //轮播图
  //1.获取轮播图数据
  function getlunData(){
    $.get("http://localhost:8888/api/swiper",(data)=>{
       // console.log(data);
        lunrender(data);
    })
  }
  getlunData();

  //轮播图循环渲染  注意：循环渲染完成后，才启动轮播图动效
  function lunrender(data){
    let str="";
    data.forEach(item=>{
        let {author,id,img,title}=item;
        str+=` <div class="swiper-slide" data-id="${id}">
                <img src="${img}" alt="">
                <div class="text">
                    <h1>${title}</h1>
                    <span>${author}</span>
                </div>
            </div>`
    })
    $(".swiper-wrapper").html(str);
    activelun();//启动轮播图
  }
  
  //启动轮播图
  function activelun(){
    var swiper = new Swiper(".mySwiper", {
        pagination: {
          el: ".swiper-pagination",
          //type: "fraction",
        },
        loop : true,
        autoplay: {
            delay: 1000,
            stopOnLastSlide: false,
            disableOnInteraction: true,
        },
      });
  }

  //列表
  let i=-1;
  let liststr="";
  //1.获取列表数据
  function getlistData(){
      let date=new Date();
      let year=date.getFullYear();
      let month=date.getMonth()+1;
      let day=date.getDate();
      let time=`${year}-${addZero(month)}-${addZero(day)}`;
     $.get(`http://localhost:8888/api/articleList?date=${time}`,function(data){
       //console.log(data);
       listrender(data);
     })
  }
  getlistData()
  
  //处理日期的一个函数
  function setdate(){
     let date=new Date()*1-(i*24*60*60*1000);
     let newDate=new Date(date);
     let month=newDate.getMonth()+1;
     let day=addZero(newDate.getDate());
     return{
         month,
         day
     }
  }
  //渲染列表数据
  function listrender(data){
     i++;//0 3.2  //1  3.1  //2  2.28  //3 2.27
     let objdate=setdate();
     if(i>0){
        liststr+=`<p>${objdate.month}月${objdate.day}日<span></span></p>`;
     }
     data.forEach(item=>{
         let {author,des,id,img,title}=item;
         liststr+=`<div class="item" data-id="${id}">
            <div class="item_left">
                <h2>${title}</h2>
                <span>${author}·${des}分钟阅读</span>
            </div>
            <img src="${img}" alt="">
        </div>`
     })
     $(".list").html(liststr);
     loadmore();
  }

  //加载更多
  function loadmore(){
       let ob=new IntersectionObserver(changes=>{
          // console.log(changes);
           if(changes[0].isIntersecting){
               if(i>6){
                ob.unobserve($(".loadmore")[0]);
                $(".loadmore").html("加载已经完成");
                return;  
               }
               getlistData();
           }
       })
       ob.observe($(".loadmore")[0])
  }
 //点击 item,跳转到详情页面
 //delegate 事件委托
   $(".list").delegate(".item","click",function(){
       let aid=$(this).attr("data-id");
       location.href="pages/article.html?id="+aid;
   })
   //点击 logo 去 login.html
   $(".tologin").click(function(){
    location.href="pages/login.html";
   })
})