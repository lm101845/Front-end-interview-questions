/*
 * @Author: liming
 * @Date: 2021-09-02 10:57:19
 * @LastEditTime: 2021-09-02 11:06:23
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\06-变量提升02.js
 */
helloWorld(); // TypeError: helloWorld is not a function

var helloWorld = function () {
  console.log("Hello World!");
};

