// axios二次封装：将公共的部分提取，简化axios的操作

//公共的baseURL
axios.defaults.baseURL="http://localhost:8888";

//处理超时时间
axios.defaults.timeout=1000;

//处理 withGredentials
axios.defaults.withGredentials=false;

//判断对象是不是纯对象
const isPlainObject = function isPlainObject(obj) {
	let proto, Ctor;
	if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
	proto = Object.getPrototypeOf(obj);
	if (!proto) return true;
	Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
	return typeof Ctor === "function" && Ctor === Object;
};
//处理transformRequest
axios.defaults.transformRequest=function(data){
    //data 必须是纯对象  {name:lili,age:18}
    if(isPlainObject(data)) {//true
        data=Qs.stringify(data)
    }
    return data
}

//拦截器
// 添加请求拦截器  发送请求之前，统一处理
// 统一添加 token
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器  返回数据后之前，统一处理
axios.interceptors.response.use(function (response) {
    //console.log(response);
    // 对响应数据做点什么
    return response.data;
  }, function (error) {
    //console.dir(error);
    //错误处理
    //1.有状态码的错误  error.response.status----404
    //2.没有状态码的错误 error.response--->undefined
    //   2.1 请求超时   code: "ECONNABORTED"
    //   2.2 没有网络，断网 Navigator 对象(BOM)包含有关浏览器的信息  
    //       navigator.onLine  true有  没有false
    let err="未知错误";
    if(error&&error.response){//有状态码的错误
       switch (error.response.status) {
        case 404:
            err="找不页面"
            break;
        case 500:
            err="服务器错误"
            break;
        default:
            err="有状态码的错误,状态码未判断,"+error.response.status
            break;
       }
    }else{//没有状态码的错误
       if(error&&error.code==="ECONNABORTED"){
          err="请求超时";
       }else if(navigator.onLine==false){
          err="请检查网络";
       }
    }
    return Promise.reject(err);
});
