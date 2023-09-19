$(function(){
    let url="login.html";

    //立刻监控是不是夜间
    let darklen=location.search.length;
    if(darklen>0){//设置成为夜间模式，按钮也要选中，url也要改变
        $(".setBox").attr("id","dark");
        $("#ye").prop("checked",true);
        url="login.html?dark=true";
    }
  
    //设置夜间模式
    $("#ye").click(function(){
        if($("#ye").prop("checked")){//选中添加dark
            $(".setBox").attr("id","dark");
            url="login.html?dark=true"
        }else{//未选中删除dark
            if( $(".setBox").attr("id")!=undefined){
                $(".setBox").removeAttr("id");
                url="login.html";
            }
        }
    })

    //返回登录页
    $(".icon-fanhui").click(function(){
        location.href=url;
    })
})