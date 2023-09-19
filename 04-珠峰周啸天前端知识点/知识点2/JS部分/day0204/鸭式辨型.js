/* 
obj是一个类数组「结构和数组类似，但不是数组（其__proto__并未指向Array.prototype）」,不能直接使用数组的方法！！但是我们的目的：期望它可以使用数组的方法！ ==> “鸭式辨型、鸭子类型”
  方案一：把类数组转换为数组 或者 让其原型链指向Array.prototype
    让其原型链指向Array.prototype
      + obj.__proto__ = Array.prototype
      + Object.setPrototypeOf(obj, Array.prototype)  推荐
    把类数组转换为数组
      + Array.from(obj)
      + [...obj] 不是所有的类数组对象都支持，类似于arguments这样的类数组集合才可以这样处理
      + 基于循环，把类数组中的每一项分别赋值给数组
      + 借用数组原型上的slice，把slice方法执行的时候，让方法中的this指向obj类数组，这样就可以“把类数组转换为数组” [].slice.call(obj) 或者 Array.prototype.slice.call(obj)

  方案二：类数组借用数组方法，去实现想要的效果
    原理：把数组原型上的方法执行，让方法中的this指向类数组，这样就相当于在操作类数组
    前提：this指向的值，它的结构和相关操作，需要和数组保持一致
    Array.prototype.xxx.call(类数组)
    [].xxx.call(类数组)
    ---
    把需要借用的方法赋值给类数组的某个私有属性
*/

const sum = function sum(...params) {
  /* // 基于ES6的剩余运算符，获取的实参集合是一个数组
  let total = 0;
  params.forEach(item => total += item);
  return total; */

  /* // arguments：函数内置的实参集合「箭头函数中没有它」，它是一个类数组
  let total = 0;
  arguments.forEach(item => total += item);
  //Uncaught TypeError: arguments.forEach is not a function
  return total; */

  // 鸭式辨型：想让arguments可以使用数组的方法
  //=======================
  // 第一种思想：把arguments类数组转数组即可
  // let arr = Array.from(arguments); //方法1
  // let arr = [...arguments]; //方法2
  /* let arr = [];
  for (let i = 0; i < arguments.length; i++) {
    let item = arguments[i];
    arr.push(item);
  } //方法3 */
  /* let arr = [].slice.call(arguments); //借用数组原型上的slice方法，让方法中的源码去操作arguments，实现把类数组转数组！！「可以借用的前提：类数组虽然不是数组，但是结构和数组类似，操作数组的那些源码，对类数组也生效！！」 //方法4
  console.log(arr); */
  /* let total = 0;
  arr.forEach(item => total += item);
  return total; */

  // 第二种思想：让类数组借用数组的方法  或者  把数组的方法赋值给类数组
  /* [].push.call(arguments, 50);
  let total = 0;
  [].forEach.call(arguments, item => total += item);
  return total; */

  /* arguments.forEach = Array.prototype.forEach;
  arguments.push = Array.prototype.push;
  arguments.push(50);
  let total = 0;
  arguments.forEach(item => total += item);
  return total; */
};
// console.log(sum(10, 20, 30, 40));


/* Array.prototype.push = function push(val) {
  this[this.length] = val;
  this.length++;
}; */
/* let obj = {
  2: 3, //1
  3: 4, //2
  length: 2, //4
  push: Array.prototype.push
};
obj.push(1);
// this->obj val->1  => 
// obj[2] = 1;  obj.length++;
obj.push(2);
// this->obj val->2 =>
// obj[3] = 2;  obj.length++;
console.log(obj); */