/*
 * @Author: liming
 * @Date: 2021-09-01 16:55:56
 * @LastEditTime: 2021-09-01 16:56:57
 * @FilePath: \01-有关代码\04-以下代码的输出结果\01.js
 */
var length = 10;
function fn() {
    return this.length + 1
}

var obj = {
    length: 5,
    test1: function () {
        return fn()
    }
}

obj.test2 = fn;
console.log(obj.test1();