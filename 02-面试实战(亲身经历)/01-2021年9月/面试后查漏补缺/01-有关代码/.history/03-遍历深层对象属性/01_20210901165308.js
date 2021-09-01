/*
 * @Author: liming
 * @Date: 2021-09-01 16:50:50
 * @LastEditTime: 2021-09-01 16:52:56
 * @FilePath: \01-有关代码\03-遍历深层对象属性\01.js
 */
function getValue(originObj, keyPath) {
    // TODO
}

var obj = {
    a: {
        b: {
            c: {
                d:1
            }
        }
    }
}

var res = getValue(obj, 'a.b.c.d');
console.log(res);  //要求打印出1

var res2 = getValue(obj, 'a.b');
console.log(res2);      //要求打印出
