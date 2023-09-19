/*
 细节知识点：
   @1 函数式编程 && 命令式编程
      函数式编程:把具体的操作过程“封装”到一个函数中,我们无需关注内部是如何处理的(How),只需要关注处理的结果(What)即可;
        + 使用便捷,开发效率高
        + 减少页面冗余代码「低耦合高内聚」
      命令式编程:具体如何去处理,是由自己实现及掌控的,关注How的过程！
        + 操作灵活,可以自主把控处理的每一个步骤
        + 处理性能一般比函数式编程式要好「例如：forEach循环要慢于for循环」
      总结：处理的数据量“较多”的情况下，使用命令式编程来提高性能！操作逻辑较为复杂，需要自己灵活把控处理步骤的情况下，也使用命令式编程！其余情况，优先推荐函数式编程！

   @2 匿名函数具名化
     特点：原本应该是匿名函数「例如：自执行函数、函数表达式、回调函数等」，但是我们会为其设置一个名字
     + 更规范的操作方式
     + 有助于匿名函数的递归操作
 */

// let arr = [10, 20, 30, 40, 50]
/* 
// 函数式编程
arr.forEach((item, index) => {
  // 本质循环五次
  if(index%2===0){
    console.log(item, index)
  }
}) 
*/

// 命令式
/* for (let i = 0; i < arr.length; i += 2) {
  // 本质循环三次
  console.log(arr[i], i)
} */

/* // 需求：迭代五次
// for (let i = 0; i < 5; i++) { }  命令式编程
new Array(5).fill(null).forEach(() => {
  // ...
}) */

//============================================
/* 
 匿名函数：没有名字（或没必要设置名字）的函数
   函数表达式：
     const xxx = function(){}  
   回调函数（或自执行函数）：
     fn(()=>{ ... })
     (function(){ ... })()
   .....

  匿名函数具名化：给匿名函数强制设置一个名字
    + 更符合规范
    + 有助于实现递归
    + ...
 */

/* (function fn() {
  // 在函数产生的私有上下文中，可以使用fn：存储的是当前函数本身
  // fn = 100 //且直接修改其值，是不会生效的
  // let fn = 100 //但是可以基于其它方式声明一下这个名字，那么此时名字就不再代表函数本身了
  console.log('我是自执行函数', fn)
})()
// console.log(fn) //Uncaught ReferenceError: fn is not defined  设置的名字不会被其外部上下文（宿主环境）所声明，所以在外面无法使用！ */

/* "use strict"
let i = 0
~function fn() {
  if (i >= 2) return
  i++
  console.log(i)
  // console.log(arguments.callee) //函数本身 BUG：在严格模式下，会报错 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
  fn()
}() */