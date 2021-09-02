/*
 * @Author: liming
 * @Date: 2021-09-02 14:35:59
 * @LastEditTime: 2021-09-02 16:36:06
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\05-手写防抖和节流\03-B站视频\02-自己实现防抖2.0.js
 */

//自己封装的防抖的函数

let count = 0;
let container = document.querySelector("#container");

function debounce(func, wait, isImmediate) {
  // 新增第三个参数，是否需要立即执行
  let timer;
  return function () {
    let _this = this;
    let args = arguments;
    clearTimeout(timeout);
    if (isImmediate) {
      //   let callNow = true
      let callNow = !timer;
      //通过对timer变量取反，判断是否执行。
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      //立即执行
      if (callNow) func.apply(this, args);
      // 不能这么写，这么写就没有防抖的效果了
    } else {
      //不会立即执行
      timer = setTimeout(function () {
        func.apply(_this, args);
      }, wait);
    }
  };
}

function doSomething(e) {
  container.innerHTML = count++;
}

container.onmousemove = debounce(doSomething, 300, true);
