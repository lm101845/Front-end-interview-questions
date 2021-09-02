/*
 * @Author: liming
 * @Date: 2021-09-01 11:47:29
 * @LastEditTime: 2021-09-02 08:22:06
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\01.js
 */
var a = 'global'
function bar(a) {
  console.log(temp); //undefined
    var temp = "local";
    console.log(a);  //undefined  //你好
}

// bar()
bar('你好')