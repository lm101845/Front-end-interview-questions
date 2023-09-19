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
	//url不能为空
	if(typeof url!=="string"){
		throw new TypeError("url must be required!")
	}
    //options是不是纯对象,如果不是纯对象，就变成纯对象
    if(!isPlainObject(options)){
	    options={}
    }
	//合并options 如果options不传递参数，是个{}，就取默认值
	//如果options传递参数，xxx，就取传递的参数
	options=Object.assign({
		jsonpName:"callback",
		params:null
	},options)
	
	return new Promise((resolve,reject)=>{
		//拼接src的值
		let {jsonpName,params}=options;
        //1.先处理params，如果params有值，值是纯对象--》urlencoded
		if(params){//如果params有值
			if(isPlainObject(params)){//值是纯对象
				//stringify(params) //转化为urlencoded
				//需要拼接到url后面,如果有?,就用&拼，如果没问号，就用?拼
				url+=`${url.includes("?")? '&':'?'}${stringify(params)}`
			}
		}
		//请求数据成功后，删除script
		function clear(){
			//页面删除 script 标签
			let myscript=document.getElementById("myscript");
			document.body.removeChild(myscript);
			
			delete window[funName];//window删除全局函数
		}
		
		let funName=`funName${+new Date()}`;//创建一个唯一的函数名
		window[funName]=function(value){
			resolve(value);//请求成功通过resolve返回
			clear();
		}
		//2.处理jsonpName
		url+=`${url.includes("?")? '&':'?'}${jsonpName}=${funName}`
		
		//创建script标签，插入到页面上
		let script=document.createElement("script");
		script.src=url;//url+options
		script.id="myscript";
		script.onerror=function(err){
			reject(err);//请求失败 通过reject返回失败
			clear();
		}
		document.body.appendChild(script);
	})
	
  };

  /* 暴露API */
  if (typeof module === 'object' && typeof module.exports === 'object') module.exports = jsonp;
  if (typeof window !== 'undefined') window.jsonp = jsonp;
})();