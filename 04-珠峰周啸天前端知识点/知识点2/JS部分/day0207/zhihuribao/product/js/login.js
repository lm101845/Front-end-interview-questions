$(function(){
    //是否为夜间模式
    let flag=location.search.includes("dark=true");
    if(flag){
        $(".loginBox").addClass("dark");
    }
    //点击返回首页
    $(".icon-fanhui").click(function(){
        location.href="../index.html";
    })
    //点击知乎图标
    $("#zhihu").click(function(){
        if($("#info").prop("checked")){
            alert("点击知乎");
        }else{
            alert("请先阅读下面的协议");
        }
    })
    //点击微博
    $("#weibo").click(function(){
        if($("#info").prop("checked")){
            alert("点击微博");
        }else{
            alert("请先阅读下面的协议");
        }
    })
    //夜间模式切换
    $("#yejian").click(function(){
        $(".loginBox").toggleClass("dark");
        // if($(".loginBox").hasClass("dark")){
        //     $(".loginBox").removeClass("dark");
        // }else{
        //     $(".loginBox").addClass("dark");
        // }
    })

    //进入设置页面
    $(".set").click(function(){
        //判断是否为夜间模式
        if($(".loginBox").hasClass("dark")){
            location.href="seting.html?dark=true";
        }else{
            location.href="seting.html";
        }
    })
 
})