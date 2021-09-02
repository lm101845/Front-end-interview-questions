/*
 * @Author: liming
 * @Date: 2021-09-01 11:47:29
 * @LastEditTime: 2021-09-02 08:25:08
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\01-var的变量提升规则.js
 */
var a = '全局作用域'
function bar() {
// function bar() {
  console.log(temp); //undefined
    var temp = "local";
    console.log(a);  //undefined  //全局作用域
}

bar()
