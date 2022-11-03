/*
 * @Author: liming
 * @Date: 2021-09-03 06:28:13
 * @LastEditTime: 2021-09-03 06:28:13
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\07-call,apply,bind,this\01-this指向.js
 */
var name = "windowsName";
function a() {
  var name = "Cherry";

  console.log(this.name); // windowsName

  console.log("inner:" + this); // inner: Window
}
a();
console.log("outer:" + this); // outer: Window
