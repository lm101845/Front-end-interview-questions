$(function(){
    //1.先获取id编号
    let aid=location.search.split("=")[1];
    //获取列表详情数据
    $.get("http://localhost:8888/api/article?id="+aid,function(data){
        //console.log(data);
        render(data);
    })

    //渲染页面
    function render(data){
      let {img,author,title,content}=data;
      //顶部图片
      $(".nav_top img").attr("src",img);
      //大标题
      $(".nav_top p").html(title);
      //作者
      $(".title span").html(author);
      //内容部分
      let str=``;
      content.forEach(item => {
        if(item.type=='text'){
            str+=`<p>${item.text}</p>`
        }else if(item.type=='img'){
            str+=`<img src="${item.img}"/>
            <h3>${item.des}</h3> `
        }
      });
      $(".con_data").html(str);
    }

    //点击返回按钮，返回首页
    $(".icon-fanhui").click(function(){
        location.href="../index.html";
    })

    //点击返回按钮之外的按钮----遮罩层显示
    $(".footer>i:not(.icon-fanhui)").click(function(){
       $(".mask").css("display","block");
    })

    //点击遮罩层，让遮罩层隐藏
    $(".mask").click(function(){
        $(".mask").css("display","none");
    })
})