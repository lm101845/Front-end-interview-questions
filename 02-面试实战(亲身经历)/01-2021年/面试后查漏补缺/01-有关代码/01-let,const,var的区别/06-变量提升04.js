/*
 * @Author: liming
 * @Date: 2021-09-02 11:19:08
 * @LastEditTime: 2021-09-02 11:20:13
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\08.js
 */

// 我们可以在`let`和`const`声明之前使用他们，只要代码不是在变量声明之前执行:
function bar() {
    console.log(name);
}

let name = 'john';

bar()  //john