/* 
  封装一个jsonp方法「基于promise管理」,执行这个方法可以发送jsonp请求 
    jsonp([url],[options])
      options配置项
      + params:null/对象 问号参数信息
      + jsonpName:'callback' 基于哪个字段把全局函数名传递给服务器
      + ...
*/
(function () {
	//是不纯对象
  const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
  };

//将纯对象--》urlencoded格式
  const stringify = function stringify(obj) {
    let keys = Reflect.ownKeys(obj),
      str = ``;
    keys.forEach(key => {
      str += `&${key}=${obj[key]}`;
    });
    return str.substring(1);
  };

  const jsonp = function jsonp(url, options) {
	//校验url
	 if(typeof url!=="string"){
       throw new Error("url必须写，格式是字符串");
	 }
	 //校验options
	 if(!isPlainObject(options)){
		options={}
	 }
     //进一步处理options的参数，给其取默认值
	 //Object.assign() 合并对象
	 options=Object.assign({
		jsonpName:"callback",
		params:{}
	 },options)

	 return new Promise((resolve,reject)=>{
		//1.处理 options jsonpName,params
		let {jsonpName,params}=options;

		function clear(){
           //1.插入页面的script要删除
            let myscript=document.getElementById("myScript");
			document.body.removeChild(myscript)
			//2.将全局的函数删除
			delete window[FunName];
		}   

		//处理params
		if(params&&isPlainObject(params)){
			params=stringify(params);
			url+=`${url.includes("?")?"&":"?"}${params}`
		}

		//随机的一个名字
        let FunName=`fun${+new Date()}`
	    window[FunName]=function(data){
			resolve(data);
			//1.插入页面的script要删除
			//2.将全局的函数删除
			clear()
		}
       //处理jsonpName这个属性
		if(jsonpName){
          url+=`${url.includes("?")?"&":"?"}${jsonpName}=${FunName}`
		}

		let script=document.createElement("script");
		script.src=url;
		script.id="myScript";
		document.body.appendChild(script);
		//script 请求失败的时候
		script.onerror=function(error){
             reject(error);
			//1.插入页面的script要删除
			//2.将全局的函数删除
			clear()
		}
	 })

  };

  /* 暴露API */
  if (typeof module === 'object' && typeof module.exports === 'object') module.exports = jsonp;
  if (typeof window !== 'undefined') window.jsonp = jsonp;
})();