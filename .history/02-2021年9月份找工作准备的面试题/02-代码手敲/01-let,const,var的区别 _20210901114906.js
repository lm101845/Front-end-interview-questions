/*
 * @Author: liming
 * @Date: 2021-09-01 11:47:29
 * @LastEditTime: 2021-09-01 11:48:24
 * @FilePath: \Front-end-interview-questions\02-2021年9月份找工作准备的面试题\02-代码手敲\01-let,const,var的区别 .js
 */
var a = 'global'
function bar(a) {
  console.log(temp); //undefined
  var temp = "local";
}

bar()