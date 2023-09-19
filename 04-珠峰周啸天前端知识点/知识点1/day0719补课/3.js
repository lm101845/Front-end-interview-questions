/* 
 Object.prototype.toString：在Number/Array/Function...的原型对象上，都有toString这个方法，但是都是用来转换为字符串的，只有 Object.prototype.toString 是用来检测数据类型的！！
   只要把 Object.prototype.toString 方法执行，让this指向谁，就是在检测谁的数据类型
   const toString = Object.prototype.toString
   toString.call([value])
 
 特点：此方案没有任何的局限性，可以检测所有值（内置类型）的类型，而且非常的精准
   + 返回结果是一个字符串，具备统一格式 "[object ?]"
   + “？” 会是啥?
     + 一般都是检测值自己所属的构造函数「只针对内置类型值」
     + 但是其内部是这样处理的：首先看要检测的值 [value] 是否具备 Symbol.toStringTag 这个属性
       + 如果有，则属性只是啥，“？”部分就是啥
         例如：
           Promise.prototype[Symbol.toStringTag] -> 'Promise'
           Math[Symbol.toStringTag] -> 'Math'
           ...
       + 如果没有，则按照刚才说的一般情况处理
 */
const toString = Object.prototype.toString

/* function Fn() { }
let f = new Fn
console.log(toString.call(f)) //"[object Object]" */

/* //需求：如何让其检测结果是 “[object Fn]”?
function Fn() { }
Fn.prototype[Symbol.toStringTag] = 'Fn'
let f = new Fn
console.log(toString.call(f)) */

//==================
/*
 除了以上四种检测类型的方式外，还有一些辅助函数，可以快速检测是不是某个类型值
   + Array.isArray 检测是否为数组
   + isNaN 检测是否为有效数字
   + ...
 */

//==================
/* 
 真实的项目中
   + 检测除 null 之外的原始值，基于 typeof 
   + 检测null -> 就看值是否为null即可，无需基于其它的方法 if([value]===null){....}
   + 精准检测对象 toString.call([value])
   + 笼统检测对象 typeof 
   + 检测函数 typeof 
   + ...
*/