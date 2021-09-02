/*
 * @Author: liming
 * @Date: 2021-09-02 10:47:06
 * @LastEditTime: 2021-09-02 10:47:06
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\05.js
 */

let str = 'global str'
function bar() {
    let str = 'local str'
}

console.log(bar);