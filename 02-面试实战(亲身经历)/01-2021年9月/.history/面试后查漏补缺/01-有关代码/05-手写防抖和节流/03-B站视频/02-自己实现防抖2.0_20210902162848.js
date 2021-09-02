/*
 * @Author: liming
 * @Date: 2021-09-02 14:35:59
 * @LastEditTime: 2021-09-02 16:28:16
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
        //立即执行
      } else {
          //不会立即执行
      timer = setTimeout(
        function () {
          func.apply(_this, args);
        },
        wait,
        isImmediate
      );
    }
  };
}

function doSomething(e) {
  container.innerHTML = count++;
}

container.onmousemove = debounce(doSomething, 300, true);
