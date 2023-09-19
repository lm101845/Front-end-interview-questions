/*
 创建一个闭包，把一些信息（可能是传递进来的实参，也可能是闭包中自己处理的值）先“保存”起来，用来供其“下级上下文中”去使用 ===> JS高阶编程技巧：柯理化函数思想{curring函数}
 但是此高阶技巧不能滥用，因为基于闭包存储，会产生不释放的内存，用的多了，内存消耗较大，项目性能会变慢；我们应该合理使用闭包，而且需要手动把不用的内存释放掉！！
 */
/* const fn = function fn(...params) {
    // params：[1, 2]
    return function anonymous(...args) {
        // args：[3]
        params = params.concat(args) //[1, 2, 3]
        return params.reduce((prev, item) => prev + item)
    }
} */
/* const fn = (...params) => (...args) => params.concat(args).reduce((prev, item) => prev + item)
let res = fn(1, 2)(3)
console.log(res) //=>6  1+2+3   */
/* const fn = (...params) => {
    return (...args) => {
        params = params.concat(args)
        return params.reduce((prev, item) => {
            return prev + item
        })
    }
} */


const curring = () => {
    let params = []
    const add = (...args) => {
        // 闭包中的params用来存储每一次执行add函数，传递的实参值
        params = params.concat(args)
        return add
    }
    add.toString = () => {
        return params.reduce((prev, item) => {
            return prev + item
        })
    }
    return add
}

let res = curring()(1)(2)(3)
// 获取的res是add函数
//  + 在谷歌老版本浏览器中，基于 console.log 输出函数，会先调用函数的 toString 方法，此方法的返回值，就是在控制台要输出的结果
//  + 新版本浏览器不再具备这个机制，输出的值都是函数本身；所以我们在前面设置一个“+”，目的是把函数对象转为数字「Symbol.toPrimitive -> valueOf -> toString -> 转数字」；这样们只需要重写相应的方法，让其把传递的实参就和即可！！
console.log(+res) //->6

res = curring()(1, 2, 3)(4)
console.log(+res) //->10

res = curring()(1)(2)(3)(4)(5)
console.log(+res) //->15 
