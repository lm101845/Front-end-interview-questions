let utils=(function(){
	function offset(ele){
	  let top=ele.offsetTop;//初始top
	  let left=ele.offsetLeft;//初始left
	  let parent=ele.offsetParent;//初始父级 parentBox
	  
	  while(parent){//bigBox  body  null(false)
		  top += parent.offsetTop+parent.clientTop;
		  left=left+parent.offsetLeft+parent.clientLeft;
		  parent=parent.offsetParent;//父级 bigBox  body  null
	  }
	  return{
		  top,
		  left
	  }	
	}
	//批量设置样式
	function setCss(ele,StyleObj){
		for(let key in StyleObj){
			//私有属性 才会 做操作
			if(StyleObj.hasOwnProperty(key)){
				//所有的封装，获取取对象属性，用中括号，更加严谨,可以识别变量
				ele.style[key]=StyleObj[key];
			}
		}
	}
	//兼容获取样式
	function getCss(ele,mystyle){
		if('getComputedStyle' in window){
			return window.getComputedStyle(ele)[mystyle];
		}else{
			return ele.currentStyle[mystyle];
		}
	}
	//....
	
	return {
		offset,
		setCss,
		getCss
	}
})()
