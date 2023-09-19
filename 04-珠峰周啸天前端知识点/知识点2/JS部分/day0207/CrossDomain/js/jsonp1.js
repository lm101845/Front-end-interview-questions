/* 
  封装一个jsonp方法「基于promise管理」,执行这个方法可以发送jsonp请求 
    jsonp([url],[options])
      options配置项
      + params:null/对象 问号参数信息
      + jsonpName:'callback' 基于哪个字段把全局函数名传递给服务器
      + ...
*/
(function () {
  const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
  };

  const stringify = function stringify(obj) {
    let keys = Reflect.ownKeys(obj),
      str = ``;
    keys.forEach(key => {
      str += `&${key}=${obj[key]}`;
    });
    return str.substring(1);
  };

  const jsonp = function jsonp(url, options) {
     if(typeof url!=="string"){
		 throw new TypeError("url must be string");
	 }
	 if(!isPlainObject(options)){
		 options={}
	 }
	 Object.assign({
		 params:null,
		 jsonpName:'callback'
	 },options)
	 
	 return new Promise((resolve,reject)=>{
		 let{params,jsonpName}=options;
		 
		 funcName=`jsonp${+new Date()}`;
		 window[funcName]=function(value){
			 resolve(value);
			 clear()
		 }
		 
		 const clear=()=>{
			 delete window[funcName];
			 let script= document.querySelector("#mysript");
			 if(script){
				document.body.removeChild(script); 
			 }
		 }
		 
		 if(params){
			 if(isPlainObject(params)){
				url+=`${url.includes("?")?"&":"?"}${stringify(params)}`;
			 }
		 }
		 url+=`${url.includes("?")?"&":"?"}${jsonpName}=${funcName}`
		 
		 console.log(url)
		 
		 let script=document.createElement("script");
		 script.src=url;
		 script.id="mysript";
		 script.onerror=function(err){
			 reject(err);
			 clear()
		 }
		 document.body.appendChild(script);
	 })
  };

  /* 暴露API */
  if (typeof module === 'object' && typeof module.exports === 'object') module.exports = jsonp;
  if (typeof window !== 'undefined') window.jsonp = jsonp;
})();