/*
 * @Author: liming
 * @Date: 2021-09-02 13:12:50
 * @LastEditTime: 2021-09-02 13:14:00
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\06-变量提升07.js
 */
let a = 1
{
  console.log(a); //1
}

console.log('全局的a',a);  //全局的a 1