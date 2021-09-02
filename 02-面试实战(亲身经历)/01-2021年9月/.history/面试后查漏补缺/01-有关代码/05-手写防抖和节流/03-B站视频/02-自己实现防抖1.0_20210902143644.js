/*
 * @Author: liming
 * @Date: 2021-09-02 14:35:59
 * @LastEditTime: 2021-09-02 14:36:30
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\05-手写防抖和节流\03-B站视频\02-自己实现防抖1.0.js
 */
let count = 0;
let container = document.querySelector("#container");
function doSomething() {
  //可能会做回调或AJAX请求
  container.innerHTML = count++;
}

container.onmousemove = _.debounce(doSomething, 300);