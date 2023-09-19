/*
JS中的数据类型
   原始值类型「基本数据类型 & 值类型」
    + number 整数、小数、零、负数、NaN(不是一个有效数字，但是属于数字类型)、Infinity(无穷大的值)...
    + string 字符串：“”、‘’、``(ES6中的模板字符串，更方便的实现字符串拼接)
    + boolean 布尔：true/false
    + null 空
    + undefined 未定义
    + symbol 唯一值(ES6+)
    + bigint 大数(ES6+)
    
   对象类型「引用数据类型」
    + 标准普通对象（纯粹的对象）  例如：{x:10,y:20}
      @1 其 __proto__ 直接指向 Object.prototype
      @2 基于 Object.create(null) 创建的对象，其没有原型链，这样的也是标准普通对象

    + 标准特殊对象
      + new Array 数组
      + new RegExp 正则
      + new Date 日期对象
      + new Error 错误对象
      + Set/Map 「ES6+新增的数据结构 」
      + ...

    + 非标准特殊对象
      原始值对应的对象数据类型值，都具备 [[PrimitiveValue]] 属性
      + 例如：new Number(1)、new String('...')、new Boolean(true)
      + 例如：Object(Symbol())、Object(10n)
      + null/undefined比较特殊，没有相应的对象类型值（没有Null/Undefined这样的构造函数）
      
    + 函数对象function
*/


/*
 symbol数据类型的作用：
   1. 想创建一个和别人不相等的值（唯一值） 
     + Symbol不能被 new 执行
     + 每一次 “Symbol(描述)” 这样执行，都是创建一个新的唯一值出来
     console.log(Symbol() === Symbol()) //false

   2. 可以给对象设置一个symbol类型(唯一)的成员「属性名」
     + 对象的“成员值”，可以是任意类型的值
     + 但是对象的“成员”只能是：字符串、symbol类型「ES6新增的Map结构，允许对象的成员是“对象类型”」

   3. 处理JS的一些底层机制！！
     + Symbol.asyncIterator
     + Symbol.iterator
     + Symbol.hasInstance
     + Symbol.toPrimitive
     + Symbol.toStringTag
     + ...
 */
/* let obj = {
  name: '哈哈哈',
  age: 25,
  0: 100, //-> '0': 100   会把成员默认转换为字符串类型
  true: 200 //-> 'true': 200
}
console.log(obj.name, obj['name']) //'哈哈哈' '哈哈哈'
console.log(obj[0], obj['0']) //100 100  在进行成员访问的时候，如果访问的成员，不是字符串格式，也要先转换为字符串格式
console.log(obj.true, obj['true'], obj[true]) //200 200 200 */

/* let aa = { x: 10 }
let bb = { y: 20 }
let obj = {
  // aa: '哈哈哈' //->成员名叫做 “aa”
  [aa]: '哈哈哈' //->把aa变量的值，作为对象的一个成员   => '[object Object]':'哈哈哈'
}
obj[bb] = '呵呵呵'  // => '[object Object]':'呵呵呵'
console.log(obj)
console.log(obj[aa] === obj[bb]) //true */

/* let sym = Symbol('AA')
let obj = {
  name: '哈哈哈',
  age: 25,
  [Symbol('AA')]: 200, //此成员是 Symbol 类型，不是字符串类型
  [sym]: 300
}
console.log(obj)
console.log(obj[Symbol('AA')]) //undefined 此处又创建了一个新的唯一值，和之前的唯一成员不是一个值
console.log(obj[sym]) //300 */

//======================================7.12开始
/*
 对象中“成员”的特点：
   + 类型的限制：字符串、symbol 
   + 规则的限制：是否可删除、是否可修改、是否可枚举、值
     可枚举：可以被 for/in循环 或者 Object.keys 列举的成员，被称为可枚举的「一般来讲，自己设置的成员都是可枚举的，内置的成员都是不可枚举的，当然我们可以去设置它的规则」
 */
/* let obj = {
  name: '哈哈哈',
  0: 100,
  [Symbol()]: 200
} */
// let keys = Object.keys(obj) // 获取对象中 “可枚举”、“非symbol类型” 私有的成员
// console.log(keys) //['0', 'name']

/* let keys = Object.getOwnPropertyNames(obj) // 获取对象中 “非symbol类型” 私有的成员
console.log(keys) //['0', 'name']
keys = Object.getOwnPropertySymbols(obj) // 获取对象中 “symbol类型” 私有的成员
console.log(keys) //[Symbol()] */
// 需求：获取对象中所有的私有成员
/* let keys = Object.getOwnPropertyNames(obj)
keys = keys.concat(Object.getOwnPropertySymbols(obj))
console.log(keys) //['0', 'name', Symbol()] */
/* let keys = Reflect.ownKeys(obj)
console.log(keys) //['0', 'name', Symbol()] */


/* 
 Object.defineProperty(对象,成员,配置项)
   作用1：给对象的某个成员设置(修改)规则「或者 给对象新增一个成员，并设置其规则」
 */
// let obj = {
//   name: '哈哈哈',
//   0: 100,
//   [Symbol()]: 200
// }
// Object.defineProperty(obj, 'name', {
//   configurable: false, //设置为不可删除
//   writable: false, //设置为不可修改
//   enumerable: false, //设置为不可枚举
// })
// Object.defineProperty(obj, 'age', {
//   // 如果基于这种方式，"给对象新增成员"，在不设置其规则的情况下，默认规则都是false，也就是默认：不可删除、不可修改、不可枚举
//   value: 25
// })
// console.log(Object.getOwnPropertyDescriptor(obj, 'age')) //查看对象中某个成员的规则
// console.log(Object.getOwnPropertyDescriptors(obj)) //查看对象所有成员的规则

//=====================================
/* Object.prototype.AAA = 1000
let obj = {
  name: '哈哈',
  0: 100,
  [Symbol()]: 200
}
define(obj, 'age', 25) */

/*
 for/in循环的“设计缺陷”：
   1.在迭代的时候，不仅去遍历私有成员，而且还会基于其原型链，遍历其原型对象上的“公有”成员「性能很差」
   2.只能迭代到 “非symbol类型”、“可枚举” 的成员「限制多、功能弱」
   所以，以后开发的时候，尽可能的不要用for/in循环！！

 问题：以后对象该如何迭代？
   + 先获取对象所有的私有成员「不受类型和枚举性的限制」 --> 包含所有私有成员的数组
   + 迭代数组中的每个成员，再获取相应的成员值即可
 */
/* for (let key in obj) {
  if (!obj.hasOwnProperty(key)) break //只要找到一个公有的，说明私有的都迭代完毕了，结束循环即可「目的：排除迭代公有的」
  console.log(key)
} */

/* let keys = Reflect.ownKeys(obj) //['0', 'name', 'age', Symbol()]
keys.forEach(key => {
  console.log(key, obj[key])
}) */


//=====================================回调函数
/*
  回调函数：把创建的函数callback作为“实参”值，传递给另外一个函数fn，在fn执行的过程中，根据相应的需求，把传递进来的callback执行！
 */
/* function fn(a, b, callback) {
  // ...
  let total = a + b //30
  let res = callback.call(xxx, total)
}
fn(
  10,
  20,
  function (x) {
    console.log(x)
    return true
  }
) */

/* Array.prototype.myForEach = function myForEach(callback) {
  // this->arr 需要迭代的数组
  // callback-> 传递的回调函数
  let self = this
  for (let i = 0; i < self.length; i++) {
    callback(self[i], i)
  }
} */

/* Array.prototype.myForEach = function myForEach(callback, context) {
  if (typeof callback !== 'function') throw new TypeError('callback必须是一个函数')
  let len = +this.length,
    k = 0
  if (isNaN(len)) throw new TypeError('迭代的数据需要是一个数组/伪数组')
  while (k < len) {
    if (this.hasOwnProperty(k)) {
      // 规避稀疏数组
      let item = this[k],
        index = k
      callback.call(context, item, index)
    }
    k++
  }
}
let arr = [10, 20, 30, 40]
let obj = { name: '哇咔咔' }
arr.myForEach(function (item, index) {
  console.log(item, index, this)
}, obj) */

/*
 创建数组：
   1. 字面量方式
     let arr = [10, 20, 30, 40]
   2. 构造函数方式
     new Array() -> []
     new Array(数字N) -> 创建一个长度是N，但是没有具体项的“稀疏数组”
     new Array(数字N).fill(null) -> 对每一项进行填充，把其变为“密集数组” 
     new Array(数字N,数字M,字符串S)
     new Array(字符串S) -> 创建一个数组，括号中的实参都是数组每一项的值
   3. Array.of(参数,...) 「ECMAScript2015」
     创建一个数组，传递的参数都是数组中每一项的值
 */


//=====================================
/*
 BigInt 大数 
   + 在JS中存在最大/最小的“安全”数字
     Number.MAX_SAFE_INTEGER -> 9007199254740991
     Number.MIN_SAFE_INTEGER -> -9007199254740991
     如果使用number类型，超过安全数字后，不论是展示还是计算，都可能会不准确
   + 作用：客户端经常和服务器进行通信，服务器端存储的数字分为 init整型、longInt长整型...，
   此时如果服务器返回一个超大数字，客户端即便获取到，一但超过最大的安全数字限制，也会丢失精准度！
   而BigInt就是为了解决大数的问题！！
   
 如何创建BigInt类型的值
   + 数字后面加一个 n 即可  -> 10n
   + BigInt(数字)
   + 和Symbol一样，不能被 new 执行

 场景方案：
   + 服务器端如果需要返回一个超大数字，此时让其以“字符串形式”把数字返回！！
   + 客户端把获取的字符串变为bigint格式 ==> BigInt(字符串)
   + 再按照需要求呈现或者和其它的bigint值进行运算
   + 最后我们把计算好的bigint值，转换为字符串，再传递给服务即可！
 */
