$(function(){
    //先判断是否为夜间
    let flag=location.search.includes("dark=true");
    if(flag){
        $(".setBox").addClass("dark");
        $("#ye").prop("checked",true);
    }
    
    //返回登录页面
    $(".icon-fanhui").click(function(){
        //是否选中为夜间模式
        if($(".setBox").hasClass("dark")){
            location.href="login.html?dark=true";
        }else{
            location.href="login.html";
        }
    })
    //夜间模式
    $("#ye").click(function(){
        $(".setBox").toggleClass("dark");
    })
})