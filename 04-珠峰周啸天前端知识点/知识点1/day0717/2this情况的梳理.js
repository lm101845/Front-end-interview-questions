// 'use strict'
/*
 this：函数的执行主体（通俗来讲，就是谁把这个函数执行的），不是函数执行所处的上下文；我们都是去研究函数中的this，全局上下文中的this是window「前提：在浏览器环境下运行」；块级私有上下文中没有自己的this，用到的this都还是宿主环境中的！
   关于函数中的THIS到底是谁，大家只需要记住这几条规律即可
   @1 给元素进行事件绑定「DOM0/DOM2」
      当事件触发，绑定的方法执行，方法中的this是当前被操作的元素「给谁绑定的，this就是谁」
   @2 普通函数执行，看函数前面是否有“点”
      + 有：“点”前面是谁，函数中的this就是谁  
        例如：
        arr.push(100) -> this:arr
        arr.__proto__.push(100) -> this:arr.__proto__
        Array.prototype.push(100) -> this:Array.prototype
        const push=Array.prototype.push
        push(100) -> this:undefined/window
        ...
      + 没有：函数中的this是window(非严格模式)或者undefined(严格模式)
      + 像 自执行函数 或者 回调函数 等匿名函数，如果没有经过特殊的处理，那么函数中的this，一般都是window/undefined
   @3 构造函数执行（NEW执行），函数体中的this指向创建的实例对象
   @4 我们可以基于 call/apply/bind 强制改变函数中this的指向
      call/apply：把函数立即执行，让函数中的this指向自己指定的值
        函数.call(THIS,实参1,实参2,...)
        函数.apply(THIS,[实参1,实参2,...])
      bind：bind语法和call一致，只不过其不是把函数立即执行，而是基于“柯理化函数思想”，创建一个闭包，把需要改变的THIS及传递的实参都事先保存起来，供后续使用！！
   @5 箭头函数/块级私有上下文中没有this，所用到的this都是其“宿主环境（或上级上下文）”中的
 */

/* const fn = function fn() {
  console.log(this)
}
const obj = {
  name: 'obj',
  fn
}
fn()
obj.fn()

obj.fn.call()
fn.call(obj)

document.body.addEventListener('click', fn) */

/* let arr = [10, 20, 30]
arr.forEach(function (item) {
  console.log(item, this)
}, obj) */


/* window.name = 'window'
const obj = {
  name: 'obj',
  fn() {
    console.log(this.name)
    setTimeout(function () {
      console.log(this.name) //this->window
    }, 1000)
  }
}
obj.fn() //this:obj
const fn = obj.fn
fn() //this:window
//「52」 'obj' 'window'
//「54」 'window' 'window' */


/* window.name = 'window'
const obj = {
  name: 'obj',
  fn() {
    // this->obj

    // setTimeout(function () {
    //   //this->window
    //   console.log(this.name)
    // }, 1000)

    // let self = this
    // setTimeout(function () {
    //   //this->window
    //   console.log(self.name)
    // }, 1000)

    setTimeout(() => {
      console.log(this.name)
    }, 1000)
  }
}
obj.fn() */


/*
 箭头函数 VS 普通函数
   + 最核心的区别：this「箭头函数中没有this」
   + 箭头函数没有 arguments 「可以基于“...”剩余运算符获取传递的实参」
   + 箭头函数没有 prototype 「不能被NEW执行」
   + 语法上的区别 「箭头函数写起来更方便/简单」
 项目中用谁？
   @1 不涉及到this的问题，用谁都可以「推荐使用箭头函数」
   @2 想作为一个构造函数，只能用普通函数
   @3 涉及this问题，用谁处理起来方便，就选择用谁「一般都是外层普通函数，内层箭头函数」
 */


//======================
/*
 在 Function.prototype 上具备 call/apply/bind 三个方法；每一个函数都是 Function 类的实例，所以都可以调用这三个方法，其目的是：改变函数执行中的this指向！！
 */

/* const fn = function fn(x, y) {
  console.log(this, x, y)
  return x + y
}
const obj = {
  name: 'obj',
  fn: 1000
} */
// 需求：把fn执行，让其this指向obj，传递10/20
// obj.fn(10, 20) //Uncaught TypeError: obj.fn is not a function「obj和fn没有关联」

/* // 不使用call方法，我们只需要让 obj 和 fn 建立关系{把函数作为obj的一个成员}
const sym = Symbol('insert-key')
obj[sym] = fn
console.log(obj[sym](10, 20))
// fn是我们自己新增的，把事情干完后，记得把新增的成员要移除掉
delete obj[sym] */

/* 重写内置的call方法 */
/* const call = function call(context, ...params) {
  // context：最后 fn 执行需要改变的 this 指向 --> obj
  // params：最后 fn 执行需要传递的实参信息 --> [10,20]
  // call 方法中的 this 是 fn
  // 最终目的：把 this（fn）执行，传递实参 params（[10,20]），并且让函数中的 “this指向” 指向 context（obj），并且接收函数执行的返回值，做为 call 执行的返回值！！
  const sym = Symbol('insert-key')
  context[sym] = this
  const result = context[sym](...params)
  delete context[sym]
  return result
} */

/* const call = function call(context, ...params) {
  // context是null/undefined，我们让其默认为 window 
  if (context == null) context = window
  // 给除null/undefined以外的原始值设置成员，不会报错，但是也不生效「也就是要求context必须是对象类型，如果不是，则转换为非标准特殊对象（装箱）」
  if (!/^(object|function)$/.test(typeof context)) context = Object(context)
  const sym = Symbol('insert-key')
  context[sym] = this
  const result = context[sym](...params)
  delete context[sym]
  return result
}
define(Function.prototype, 'call', call)

// console.log(fn.call(null, 10, 20))
console.log(fn.call(1000, 10, 20)) */

/* console.log(
  /!* 
  步骤：
  @1 fn函数首先基于 __proto__，找到 Function.prototype 上的 call 方法，并且把找到的 call 方法执行；
  @2 给 call 方法传递了 obj/10/20 三个实参，call 方法中的 this 是要操作的函数 fn
  @3 call 方法的执行，做了以下的事情「方法内部实现的」：
    + 把 fn(call中的this) 执行
    + 把 fn 中的 this 改为 obj（给call方法传递的第一个实参）
    + 把第二个及以后传递给call方法的实参，作为参数传递给fn
    + 接收fn执行的返回值，作为call执行的返回值
  *!/
  fn.call(obj, 10, 20)
) */

/* 课后思考题： */
/* const fn1 = function () {
  console.log('fn1')
}
const fn2 = function () {
  console.log('fn2')
}
console.log(fn1.call(fn2))
console.log(fn1.call.call.call(fn2))
console.log(Function.prototype.call(fn2))
console.log(Function.prototype.call.call.call(fn2)) */


//==============================================

/* const fn = function fn(x, y, ev) {
  console.log(this, x, y, ev)
}
const obj = {
  name: 'obj',
  fn: 1000
} */

/* 需求：点击Body的时候执行fn，让fn中的this是obj，让x/y是10/20，让ev是事件对象*/
/* // 点击Body执行fn，fn->this:body  x:事件对象  y:undefined
document.body.onclick = fn  */

/* // call方法会把fn立即执行，不等点击Body就执行了
document.body.onclick = fn.call(obj, 10, 20) */

/* // 点击Body才会执行匿名函数
document.body.onclick = function (ev) {
  // this:body  ev:事件对象
  // 在匿名函数执行的时候，再基于call方法，把真正要执行的函数fn执行，改变其this和参数即可
  fn.call(obj, 10, 20, ev)
} */

/* const bind = function bind(context, ...params) {
  // this->fn  context->obj  params->[10,20]
  let that = this
  return function anonymous(...args) {
    // this->body  args->[ev]
    // 在返回的匿名函数执行中，把真正需要执行的函数执行「改变THIS & 传递实参」
    params = params.concat(args)
    return that.call(context, ...params)
  }
}
define(Function.prototype, 'bind', bind)

// 基于bind可以解决我们的需求：预先改变函数中的this指向(及参数)，但是不会把函数立即执行
document.body.onclick = fn.bind(obj, 10, 20)
// document.body.onclick = anonymous  点击的时候执行的是bind返回的小函数anonymous */


// ==============================================
const call = function call(context, ...params) {
  if (context == null) context = window
  if (!/^(object|function)$/.test(typeof context)) context = Object(context)
  const sym = Symbol('insert-key')
  context[sym] = this
  const result = context[sym](...params)
  delete context[sym]
  return result
}
const apply = function apply(context, params) {
  if (context == null) context = window
  if (!/^(object|function)$/.test(typeof context)) context = Object(context)
  const sym = Symbol('insert-key')
  context[sym] = this
  const result = context[sym](...params)
  delete context[sym]
  return result
}
const bind = function bind(context, ...params) {
  let that = this
  return function anonymous(...args) {
    params = params.concat(args)
    return that.call(context, ...params)
  }
}
define(Function.prototype, 'call', call)
define(Function.prototype, 'apply', apply)
define(Function.prototype, 'bind', bind)