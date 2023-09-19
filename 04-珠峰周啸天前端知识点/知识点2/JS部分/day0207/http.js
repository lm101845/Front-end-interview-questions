//配置公共的基础路径
axios.defaults.baseURL="http://127.0.0.1:9999";

//配置公共的超时时间
axios.defaults.timeout=60000;

//配置公共的withCredentials
axios.defaults.withCredentials=true;

//配置公共的 validateStatus
axios.defaults.validateStatus=function(status){
	return status>=200&&status<400
}

//判断是不是纯对象
const isPlainObject = function isPlainObject(obj) {
	let proto, Ctor;
	if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
	proto = Object.getPrototypeOf(obj);
	if (!proto) return true;
	Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
	return typeof Ctor === "function" && Ctor === Object;
};

//配置公共的transformRequest----只修改post请求 data的参数
axios.defaults.transformRequest=function(data){
	if(isPlainObject(data)){//必须是纯对象（{}），才将对象转化为 urlencoded  
		data=Qs.stringify(data);
	}
	return data;
}

// 添加请求拦截器----客户端向服务器发送请求的时候，请求头和体，要做一些处理的时候可以添加请求拦截器
//添加 token****
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器  服务器把数据返回给客户端，先对 数据（响应头和响应体）进行统一处理，在给你
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;//数据，统一返回response.data里面的内容
  }, function (error) {
	  //console.dir(error);
	  //1. 有状态码的错误  response---》status（true)
	  //2. 没有状态码的错误  
	  //    2.1 请求超时的错误 code: "ECONNABORTED"   response：undefined(false)
	  //    2.2 断网了    navigator.onLine(有网)
	  let err="未知错误";
	  if(error&&error.response){//有状态码的错误
	      let {status}=error.response;
		  switch (status){
		  	case 404:
			    err="找不到页面"
		  		break;
			case 500:
			    err="服务器内部错误"
				break;
			case 505:
			    err="HTTP版本不支持"
				break;
		  	default:
			    err="未知错误";
		  		break;
		  }
	  }else{//没有状态码的错误
		  if(error&&error.code==="ECONNABORTED"){//请求超时
			  err="请求超时！"
		  }else if(!navigator.onLine){//断网了
			  err="断网中断！"
		  }
	  }
    // 对响应错误做点什么
    return Promise.reject(err);
  });
  