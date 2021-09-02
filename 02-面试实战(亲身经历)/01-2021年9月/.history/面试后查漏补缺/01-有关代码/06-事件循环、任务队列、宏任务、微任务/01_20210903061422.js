/*
 * @Author: liming
 * @Date: 2021-09-03 06:13:05
 * @LastEditTime: 2021-09-03 06:14:22
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\06-事件循环、任务队列、宏任务、微任务\01.js
 */
setTimeout((_) => console.log(4));

new Promise((resolve) => {
  resolve();
  console.log(1);
}).then((_) => {
  console.log(3);
});

console.log(2);

//1 2 3 4

// 在当前的微任务没有执行完成时，是不会执行下一个宏任务的。
