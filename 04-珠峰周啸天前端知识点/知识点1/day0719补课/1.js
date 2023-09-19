/*
 instanceof：本意是检测某个对象是否是指定构造函数的实例 
   对象 instanceof 构造函数
   + 用其检测数据类型，主要是弥补 typeof 不能细分对象的缺陷的
   + 只要 instanceof 左边是原始值，则结果都是 false
     + 理解1：instanceof不能用来检测原始值类型
     + 理解2：实例都是对象类型的，所以原始值不可能是任何类的实例
   + instanceof 的右边必须是一个函数
     否则报错：TypeError: Right-hand side of 'instanceof' is not callable
     + 而且函数必须具备 prototype 属性 「否则报错：TypeError: Function has non-object prototype 'undefined' in instanceof check」
     + 虽然Symbol/BigInt不能被new执行，但是他们确实是构造函数，可以出现在 instanceof 的右侧

   检测机制(原理)：
   + 首先看 构造函数 是否具备 Symbol.hasInstance 属性，如果具备这个属性(方法)，则把方法执行
     构造函数[Symbol.hasInstance](对象) -> true/false
     + 只要是支持ES6的浏览器，函数必然具备Symbol.hasInstance属性，因为这个属性在 Function.prototype
   + 没有这个属性，再看 构造函数.prototype 是否出现在 对象 的原型链上

   局限性：
   + 无法检测原始值
   + 无法区分是否为“标准普通对象（纯粹对象）”「所有对象都是Object的实例，基于 instanceof 检测都是true」
   + 检测结果仅供参考「因为我们可以重构实例对象的原型链」
 */
/* function Fn() { }
Fn.prototype = Object.create(Array.prototype)
Fn.prototype.constructor = Fn
let f = new Fn */
/* class Fn extends Array {
    constructor() {
        super() // Array.call(this)
    }
}
let f = new Fn
console.log(f instanceof Array) //true */

/* let obj = {}
obj.__proto__ = Array.prototype
console.log(obj instanceof Array) //true */

/* let arr = []
console.log(arr instanceof Array) //true
// Array[Symbol.hasInstance](arr)
console.log(arr instanceof RegExp) //false
// RegExp[Symbol.hasInstance](arr)
console.log(arr instanceof Object) //true
// ... */

var instance_of = function instance_of(obj, Ctor) {
    // 确保右侧是标准的构造函数
    if (typeof Ctor !== 'function') throw new TypeError('Right-hand side of instanceof is not callable')
    var proto = Ctor.prototype
    if (!proto) throw new TypeError('Function has non-object prototype undefined in instanceof check')
    // 如果左边是原始值，则直接返回false
    if (obj === null || !/^(object|function)$/.test(typeof obj)) return false
    // 如果构造函数具备 Symbol.hasInstance ，则直接基于其处理即可
    if (typeof Symbol !== 'undefined') {
        var hasInstance = Ctor[Symbol.hasInstance]
        if (hasInstance) {
            return hasInstance.call(Ctor, obj)
        }
    }
    // 如果不支持，才基于原型链进行查找匹配
    return proto.isPrototypeOf(obj)
    /* var o = Object.getPrototypeOf(obj) // obj.__proto__
    while (o) {
        // o：一轮轮查找，在obj原型链上出现的原型对象
        if (o === proto) return true
        o = Object.getPrototypeOf(o)
    }
    return false */
}