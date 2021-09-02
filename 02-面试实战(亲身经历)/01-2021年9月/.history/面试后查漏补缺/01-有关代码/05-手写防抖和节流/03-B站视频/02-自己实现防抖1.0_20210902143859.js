/*
 * @Author: liming
 * @Date: 2021-09-02 14:35:59
 * @LastEditTime: 2021-09-02 14:38:46
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\05-手写防抖和节流\03-B站视频\02-自己实现防抖1.0.js
 */

//自己封装的防抖的函数
function debounce(func, wait) {
    return function () {
        //当你调用debounce函数的时候，内部返回一个函数——这个就闭包了
        setTimeout((func, wait) => {
            
        },wait)
    }
}
let count = 0;
let container = document.querySelector("#container");
function doSomething() {
  //可能会做回调或AJAX请求
  container.innerHTML = count++;
}

container.onmousemove = debounce(doSomething, 300);