$(function(){
    //获取页面的id编号
   let urlstr=location.search;//?id=9736137
   let index=urlstr.indexOf("=");//3
   let myid=urlstr.slice(index+1);//9736137

    //获取数据
    function getDate(){
        $.get("http://localhost:8888/api/article?id="+myid,function(data){
            console.log(data);
            render(data);
        })
    }
    getDate();

    //循环渲染
    function render(data){
        let {author,content,id,img,title}=data;
        $(".con_top img").attr("src",img);
        $(".con_top h1").html(title);
        $(".authour span").html(author);
        let str="";
        content.forEach(item=>{
            if(item.type=="text"){
                str+=`<p class="text">${item.text}</p>`
            }else{
                str+=`<div class="img">
                        <img src="${item.img}" alt="">
                        <p class="des">${item.des}</p>
                    </div>`
            }
        })
        $(".contentdata").html(str);
    }

    //返回首页
    $(".icon-fanhui").click(function(){
        location.href="../index.html";
    })
    //点击字体图标，显示遮罩层
    $(".iconfont:not(.icon-fanhui)").click(function(){
       $(".mark").show();
    })
    //点击遮罩层，隐藏
    $(".mark").click(function(){
        $(".mark").hide();
    })
})