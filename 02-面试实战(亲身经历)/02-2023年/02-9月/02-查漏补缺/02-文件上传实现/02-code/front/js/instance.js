//把发送请求的公共信息进行提取
let instance = axios.create();
//创建一个单独的实例(以防和别人的配置项进行冲突)
instance.defaults.baseURL = 'http://127.0.0.1:8888';
instance.defaults.headers['Content-Type'] = 'multipart/form-data';
instance.defaults.transformRequest = (data, headers) => {
    /**
     * 'transformRequest' 是一个允许你在请求被发送到服务器之前修改请求数据的配置。它可以是一个函数或者一个函数数组，
     * 这些函数将按照顺序应用到请求数据上。这可以用于例如，在发送请求之前对数据进行序列化，或者对数据进行其他形式的处理。
     *
     * transformRequest只针对于post请求
     */
    const contentType = headers['Content-Type'];
    if (contentType === "application/x-www-form-urlencoded") return Qs.stringify(data);
    return data;
};


instance.interceptors.response.use(response => {
    return response.data;
    //不然每次拿到response的时候，还要.data才能拿到东西,麻烦
});
