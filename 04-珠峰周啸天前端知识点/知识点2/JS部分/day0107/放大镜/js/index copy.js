(function(){
    //求大图片的高度和宽度
    let leftbox=document.querySelector(".leftbox");
    let rightbox=document.querySelector(".rightbox");
    let mark=document.querySelector(".mark");
    let bigimg=document.querySelector(".rightbox img");

    function getwh(ele,style){
        let value=0;
        if(style=="width"){
           value= parseInt(getComputedStyle(ele)[style])+
           parseInt(getComputedStyle(ele).paddingLeft)+
           parseInt(getComputedStyle(ele).paddingRight)+
           parseInt(getComputedStyle(ele).borderLeftWidth)+
           parseInt(getComputedStyle(ele).borderRightWidth)
        }else{
        }
        console.log(value)
        return value;
    }

    //左侧盒子的高度和宽度
    let leftw=leftbox.offsetWidth;
    let lefth=leftbox.offsetHeight;

    //遮罩层的高度和宽度
    //offsetWidth offsetHeight 必须显示的元素，display:none的求出来为0
    let markw=getwh(mark,"width");
    //let markh=getwh(mark,"height");
    
    //右侧盒子的高度和宽度
    // let rightw=getwh(rightbox,"width");
    // let righth=getwh(rightbox,"height");

    //求大图片的比例 高度和宽度
    // bigimg.style.width=rightw/markw*leftw+"px";
    // bigimg.style.height=righth/markh*lefth+"px";
})()