/*
 * @Author: liming
 * @Date: 2021-09-02 14:35:59
 * @LastEditTime: 2021-09-02 14:56:53
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\05-手写防抖和节流\03-B站视频\02-自己实现防抖1.0.js
 */

//自己封装的防抖的函数

let count = 0;
let container = document.querySelector("#container");


function debounce(func, wait) {
    let timeout;
    //当你调用debounce函数的时候，内部返回这个函数——这个就闭包了
    return function () {
        // console.log(this);
        //container
        // 这个函数内部的this指向，就是当前对象的执行者——container

        let _this = this;
        //改变执行函数内部this的指向
    clearTimeout(timeout);
    timeout = setTimeout(func.apply(this, arguments),wait);
  };
}



function doSomething() {
    console.log(this);
     //window
    // 我们应该让当前的this指向我们当前的container才好！！！
  //可能会做回调或AJAX请求
  container.innerHTML = count++;
}

container.onmousemove = debounce(doSomething, 300);
