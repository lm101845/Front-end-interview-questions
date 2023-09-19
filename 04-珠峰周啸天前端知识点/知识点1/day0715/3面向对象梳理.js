/* 
 面向对象是一种“编程思想「OOP：Object-Oriented Programming」”，在此思想中，最主要的就是：对象、类、实例
   对象：一种泛指，JS中所有的内容都是我们要学习、研究和使用的对象
   类：把所有的内容，按照功能特征进行划分，分为一些大类（父类）和小类（子类）
   实例：类中具体的事物，其具备一些自己私有的属性和方法，也拥有类赋予其的，公有的属性和方法

 类「构造函数：所有的类本身都是函数数据类型」
   + 内置类
     + 数据类型内置类：Number、String、Boolean、Symbol、BigInt、Object、Array、RegExp、Date、Error、Function...（每一种数据类型值，都是自己所属类的实例）
     + DOM相关的内置类
       元素集合类：HTMLCollection
       节点集合类：NodeList
       每一个元素标签(或元素对象)都有自己所属的类：HTMLBodyElement、HTMLDivElement、HTMLBodyElement、HTMLAnchorElement、HTMLParagraphElement...
       大类分小类的链条：HTMLXxxElement -> HTMLElement -> Element -> Node -> EventTarget -> Object
       ...
     + IntersectionObserver
     + Promise
     + ......
   + 自定义类
     @1 创建一个函数「约定的规范：函数名遵循 PascalCase 规范 」
     @2 基于 new 来执行这个函数
       + 此时这个函数就变成了“构造函数（类）”
       + 返回值一般都是这个类的实例


 实例「所有的实例都是对象数据类型的」
   创建实例的方式
   + 字面量方式「含基于特定API创建」
   + 基于 new 创建「构造函数方式」
 */

/* 
// 对于对象数据类型来讲，即便基于不同方式，但创造出来的结果都一样：都是某个类的实例、都是对象数据类型的值
let arr1 = [10, 20, 30]
let arr2 = Array.of(10, 20, 30)
let arr3 = new Array(10, 20, 30)
console.log(arr1, arr2, arr3) 
*/

/* // 但是对于原始类型来讲，基于字面量方式创造的是原始值，不是所属类的实例；基于构造函数方式（或者基于 Object([value]) 这种方式）创造出来的是“非标准特殊对象”，这些才是所属类的实例！！
let num1 = 10
let num2 = new Number(10)
let num3 = Object(10)
console.log(num2.toFixed(2)) //'10.00'
console.log(num1.toFixed(2)) //'10.00' 浏览器默认会进行“装箱”：把原始值转为对象类型的值「基于 Object([value]) 方法处理的」
console.log(num1 + 10) //20
console.log(num2 + 10) //20  浏览器默认会进行“拆箱”：把对象类型的值转为原始值 */


/* function Fn(x, y) {
    let sum = 10
    this.total = x + y
    this.say = function () {
        console.log(`我计算的和是:${this.total}`)
    }
}
let res = Fn(10, 20) //作为普通函数执行
let f1 = new Fn(10, 20) //作为构造函数执行 “有参数列表NEW”「优先级18，和成员访问/函数执行一致」
let f2 = new Fn //作为构造函数执行 “无参数列表NEW”「优先级17」
console.log(f1.sum)
console.log(f1.total)
console.log(f1.say === f2.say) */


function Foo() {
    getName = function () {
        console.log(1)
    }
    return this
}
Foo.getName = function () {
    console.log(2)
}
Foo.prototype.getName = function () {
    console.log(3)
}
var getName = function () {
    console.log(4)
}
function getName() {
    console.log(5)
}
Foo.getName()
getName()
Foo().getName()
getName()
new Foo.getName()
new Foo().getName()
new new Foo().getName() 

