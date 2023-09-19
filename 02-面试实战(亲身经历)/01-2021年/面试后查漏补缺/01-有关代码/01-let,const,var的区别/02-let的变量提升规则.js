/*
 * @Author: liming
 * @Date: 2021-09-02 08:22:53
 * @LastEditTime: 2021-09-02 08:27:13
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\02-let的变量提升规则.js
 */
function foo() {
  console.log(a); //ReferenceError: Cannot access 'a' before initialization
  let a = 123;
}

foo()