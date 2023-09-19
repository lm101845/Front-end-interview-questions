/*
 建议以后定义函数，都使用“函数表达式”的方式
   const xxx = function(){
      ...
   };
   这样只能在创建函数的代码之后，调用函数执行，让代码逻辑更加的严谨！！
   这样处理，创建的函数是匿名函数！！

 有一个更加规范的写法：把匿名函数具名化！！
 */
/* const func = function func() {
    console.log('func');
};
func(); */

/* 
匿名函数具名化：原本是没有名字的匿名函数，现在非要加一个名字 
  @1 设置的名字，不会在“宿主环境”中进行声明「也就是在外面依然无法使用，也不会和外面的变量产生冲突」
  @2 但是在自己产生的私有上下文中，名字会被声明和定义，值就是当前函数本身！！「这样可以代替arguments.callee，实现匿名函数的递归处理」
  @3 而且默认情况下，此时函数名是无法被修改值的「值就是函数本身」
    + 非严格模式下：改值操作不生效
    + 严格模式下：一但改值，则直接报错
    + 除非基于let/const等方式，重新声明这个名字
*/
"use strict";
let num = 0;
(function anony() {
    if (num >= 5) return;
    console.log(++num);
    // anony();
})();
// console.log(anony); //Uncaught ReferenceError: anony is not defined


/* 
"use strict";
let num = 0;
(function () {
    if (num >= 5) return;
    num++;
    console.log(num);
    // console.log(arguments.callee); //获取的是当前函数本身「但是仅限在JS非严格模式下，严格模式下是禁止使用arguments.callee/caller」
    arguments.callee();
})(); 
*/


/* let num = 0;
const func = function () {
    if (num >= 5) return;
    console.log(++num);
    func();
};
func(); */