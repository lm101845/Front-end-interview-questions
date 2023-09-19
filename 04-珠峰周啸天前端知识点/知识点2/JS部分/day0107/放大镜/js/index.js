(function(){
    //求大图片的高度和宽度
    let leftbox=document.querySelector(".leftbox");
    let rightbox=document.querySelector(".rightbox");
    let mark=document.querySelector(".mark");
    let bigimg=document.querySelector(".rightbox img");

    function getwh(ele,style){
        return parseInt(getComputedStyle(ele)[style]);
    }

    //左侧盒子的高度和宽度
    let leftw=leftbox.offsetWidth;
    let lefth=leftbox.offsetHeight;

    //遮罩层的高度和宽度
    //offsetWidth offsetHeight 必须显示的元素，display:none的求出来为0
    let markw=getwh(mark,"width");
    let markh=getwh(mark,"height");
    
    //右侧盒子的高度和宽度
    let rightw=getwh(rightbox,"width");
    let righth=getwh(rightbox,"height");

    //求大图片的比例 高度和宽度
    bigimg.style.width=rightw/markw*leftw+"px";
    bigimg.style.height=righth/markh*lefth+"px";

    //移入左侧盒子  遮罩+右侧盒子显示
    leftbox.onmouseenter=function(){
        mark.style.display="block";
        rightbox.style.display="block";
    }

    //移出左侧盒子  遮罩+右侧盒子隐藏
    leftbox.onmouseleave=function(){
        mark.style.display="none";
        rightbox.style.display="none";
    }

    //鼠标在左侧盒子里面移动 遮罩也会跟着移动
    leftbox.onmousemove=function(e){
      let resultX= e.clientX-markw/2-leftbox.offsetLeft;
      let resultY= e.clientY-markh/2-leftbox.offsetTop;
      
      //遮罩最大的移动范围
      let maxw=leftw-markw;
      let maxh=lefth-markh;
      
      //遮罩移动范围
      resultX = resultX>=maxw?maxw:(resultX<=0?0:resultX);
      resultY = resultY>=maxh?maxh:(resultY<=0?0:resultY);

      mark.style.left=resultX+"px";
      mark.style.top=resultY+"px";
     
      //大图片按照比例移动
      //遮罩往下移动，大图片就是网上移动，方向相反，一定要加负号
      bigimg.style.left="-"+(rightw/markw*resultX)+"px";
      bigimg.style.top="-"+(righth/markh*resultY)+"px";
    }

})()