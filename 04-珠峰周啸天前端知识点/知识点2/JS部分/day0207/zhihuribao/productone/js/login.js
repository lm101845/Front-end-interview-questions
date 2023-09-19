$(function(){
   //进入login页面，先判断有没有 dark
   let darklen=location.search.length;
   //有dark=true这个字段，要设置夜间模式
   if(darklen>0){//设置夜间
     $(".loginbox").attr("id","dark");
   }
   
    //点击返回按钮，返回首页
    $(".icon-fanhui").click(function(){
        location.href="../index.html";
    })

    //点击知乎
    $("#zhihu").click(function(){
        if($("#check").prop("checked")){
            alert("点击了知乎");
        }else{
            alert("请先阅读下面的协议");
        }
    })

    //点击微博
    $("#weibo").click(function(){
        if($("#check").prop("checked")){
            alert("点击了微博");
        }else{
            alert("请先阅读下面的协议");
        }
    })
    
    let url="setting.html";
    //切换夜间模式
    $("#yejian").click(function(){
        if($(".loginbox").attr("id")=="dark"){//dark
            $(".loginbox").removeAttr("id");
            url="setting.html";
        }else{//undefined
            $(".loginbox").attr("id","dark");
            url="setting.html?logindark=true";
        }
    })

    //点击设置按钮，跳转到设置页面
    $("#shezhi").click(function(){
        location.href=url;
    })
})