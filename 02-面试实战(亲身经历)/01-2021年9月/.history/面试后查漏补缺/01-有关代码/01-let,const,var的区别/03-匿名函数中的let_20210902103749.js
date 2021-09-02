/*
 * @Author: liming
 * @Date: 2021-09-02 08:29:04
 * @LastEditTime: 2021-09-02 10:37:14
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\03-匿名函数中的let.js
 */
let a = 3;
let b;
(function () {
  console.log(a, "@");
  console.log(b, "@");
  let a = (b = 3);
  console.log(a, "@");
  console.log(b, "@");
})();

console.log(a);
console.log(b);
