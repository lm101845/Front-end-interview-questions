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
    // 格式校验 && 合并默认配置项
    if (typeof url !== "string") throw new TypeError("url must be required!");
    if (!isPlainObject(options)) options = {};
    let { params, jsonpName } = Object.assign({
      params: null,
      jsonpName: 'callback'
    }, options);

    // 基于Promise进行管理
    return new Promise((resolve, reject) => {
      // 把PARAMS中的信息拼接到URL的末尾
      if (isPlainObject(params)) {
        url += `${url.includes('?') ? '&' : '?'}${stringify(params)}`;
      }

      // 清空全局函数和SCRIPT
      const clear = () => {
        delete window[funcName];
        const script = document.querySelector('#script');
        if (script) document.body.removeChild(script);
      };

      // 创建全局函数（我们设置的函数名不能对其他的全局函数有影响）
      const funcName = `jsonp${+new Date()}`;
      window[funcName] = function (value) {
        // 请求成功
        resolve(value);
        clear();
      };

      // 创建SCRIPT发送请求
      const script = document.createElement("script");
      script.id = "script";
      script.src = `${url}${url.includes('?') ? '&' : '?'}${jsonpName}=${funcName}`;
      script.onerror = err => {
        // 请求失败
        reject(err);
        clear();
      };
      document.body.appendChild(script);
    });
  };

  /* 暴露API */
  if (typeof module === 'object' && typeof module.exports === 'object') module.exports = jsonp;
  if (typeof window !== 'undefined') window.jsonp = jsonp;
})();