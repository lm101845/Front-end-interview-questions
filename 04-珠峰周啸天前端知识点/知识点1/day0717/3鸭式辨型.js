/* 
类(伪)数组 
  + arguments
  + 元素集合/节点集合
  + ...
伪数组：是结构和数组相似「以数字作为索引、索引从零开始、逐级递增、具备length属性」，但是其 __proto__ 没有指向 Array.prototype，所以其并不是 Array 类的实例
  + 不能直接使用 Array.prototype 上提供的方法
  + 伪数组 instanceof Array -> false
*/

/*
 在JS中有很多 “伪(类)xxx” 的概念
   @1 伪(类)数组
     + 对于数组来讲，它的结构特征：数字做为索引、索引从0开始逐级递增、具备length属性记录其长度
     + 每一个数组都是 Array 类的实例，其 __proto__ 指向 Array.prototype「所以其可以直接使用Array原型对象上的 push/pop/forEach... 等方法」
     + 伪数组在结构上和数组几乎一模一样，但是其 __proto__ 并不指向 Array.prototype「所以不能直接调用数组提供的方法」，常见的伪数组有：arguments、元素集合、节点集合...
   @2 伪(类)promise「或者 thenable」
     + 基于 new Promise 所创造出来的实例，被称为标准的 promise 实例，其拥有 状态 和 值，也可以调用 Promise.prototype 上的 then/catch/finally 这些方法！
     + 我们可以遵照 PromiseA+规范，自己创造一个同样具备 状态和值，也具备 then 方法的实例，此实例被称为“类promise 或 thenable”  
   ...
   在我们平时的开发中，我们往往会出现这样的需求：让伪数组调用数组的方法，去实现相应的功能，此时就需要我们对伪数组做一些特殊的处理，而这个过程，有人把其叫做 “鸭式辨型 / 鸭子类型”！
  ------------
  特殊的处理方案
    @1 把需要借用的方法，赋值给伪数组的私有属性
      原理：首先要保证伪数组可以访问到这个方法；然后把方法执行，让方法中的this变为要操作的伪数组；因为伪数组和数组的“结构几乎一模一样”，所以操作数组的那些代码，“对于伪数组也基本上都生效”；
      let obj = { 0: 10, 1: 20, length: 2 }
      obj.push(30) //报错：obj.push is not a function
      obj.push = Array.prototype.push
      obj.push(30) //正常处理

    @2 基于上述原理的分析，我们只需要把数组的方法执行，“让方法中的this变为伪数组”，这样就相当于伪数组直接借用数组的方法，去实现相应的效果了！
      let obj = { 0: 10, 1: 20, length: 2 }
      Array.prototype.push.call(obj,30)
      [].push.call(obj,30)
      ----
      [].forEach.call(obj,(item,index)=>{
        ...
      })
      ...
    
    @3 其实我们还可以直接修改伪数组的原型指向，让其指向 Array.prototype，这样数组的所有方法，伪数组都可以直接调用了！！
      let obj = { 0: 10, 1: 20, length: 2 }
      // obj.__proto__=Array.prototype
      Object.setPrototypeOf(obj, Array.prototype)
    
    @4 把伪数组直接转换为数组后，再去进行相应的操作即可
      let obj = { 0: 10, 1: 20, length: 2 }
      let arr = Array.from(obj)
      arr = [...obj]
      arr = [].slice.call(obj,0)
      ...
 */

/* 
鸭式辨型有一个很重要的前提：伪数组的结构以及一些操作，几乎和数组一模一样（或者说对数组的这些操作「迭代、判断、取值等等」，可以无缝衔接到伪数组上）
数组原型上的这些方法，并非是伪数组不能用（只要能让方法执行，让方法中的this指向伪数组，则内部操作的那些代码对伪数组一样可以进行操作），而是伪数组基于原型链查找机制，找不到Array.prototype上的这些方法，才导致的不能用！
 */
/* let arr = [10, 20, 30]
let obj = {
  0: 10,
  1: 20,
  2: 30,
  length: 3,
  forEach: Array.prototype.forEach
}
Object.setPrototypeOf(obj, Array.prototype) */

/* 
Array.prototype.forEach = function forEach(callback, context) {
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
*/

/* obj.forEach((item, index) => {
  console.log(item, index)
})

Array.prototype.forEach.call(obj, (item, index) => {
  console.log(item, index)
}) */




//======================================
/* 
Array.prototype.push = function push(...params) {
  // this->操作的数组/伪数组   params->[...]包含向末尾新增的内容
  for (let i = 0; i < params.length; i++) {
    let item = params[i]
    this[this.length] = item
    // this.length++ 
  }
  return this.length
}
let arr = [10, 20]
let len = arr.push(1000, 2000, 3000)
console.log(len, arr)
*/

let obj = {
  2: 3, //1
  3: 4, //2
  length: 2, //3(4)
  push: Array.prototype.push
}
obj.push(1)
// this[this.length] = item  this.length++ 
// obj[2] = 1   obj.length++ 
obj.push(2)
// this[this.length] = item  this.length++ 
// obj[3] = 2   obj.length++ 
console.log(obj)