/*
 * @Author: liming
 * @Date: 2021-09-02 11:33:16
 * @LastEditTime: 2021-09-02 11:34:29
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\06-变量提升06.js
 */
function person(status) {
  if (status) {
    let value = "蛙人"; //ReferenceError: value is not defined
    // var value = "蛙人";
  } else {
    console.log(value); // undefined
  }
  console.log(value); // undefined
}
person(false);
