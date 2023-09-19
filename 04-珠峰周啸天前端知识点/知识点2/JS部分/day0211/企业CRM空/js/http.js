//baseurl
axios.defaults.baseURL="http://127.0.0.1:9999";

//超时时间
axios.defaults.timeout=60000;

//是否允许跨域资源凭证
axios.defaults.withCredentials=true;

//判断是不是纯对象
const isPlainObject = function isPlainObject(obj) {
	let proto, Ctor;
	if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
	proto = Object.getPrototypeOf(obj);
	if (!proto) return true;
	Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
	return typeof Ctor === "function" && Ctor === Object;
};

//urlencoded 格式
axios.defaults.transformRequest=function(data){
	if(isPlainObject(data)){
		data=Qs.stringify(data);
	}
	return data;
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
	let token=localStorage.getItem("token");
	//请求头里配置了authorzation=token
	config.headers.authorzation=token;
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
  }, function (error) {
	  //console.dir(error);
    // 对响应错误做点什么
	let err="";
	//... 1.状态码 error.response 2.请求超时  3.网络问题
	if(error&&error.response){//1.状态码 error.response
	    let {status}=error.response;
		switch(status){
			case 404:
			  err="找不到页面";
			case 500:
			  err="服务器有问题";
			default:
			  err="未知错误";
		}
	}else{//2.请求超时 code "ECONNABORTED" 
		if(error&&error.code==="ECONNABORTED"){
			err="请求超时"
		}else if(!navigator.onLine){// 3.网络问题
			err="网络问题"
		}
	}
	return err;
    //return Promise.reject(error);
  });