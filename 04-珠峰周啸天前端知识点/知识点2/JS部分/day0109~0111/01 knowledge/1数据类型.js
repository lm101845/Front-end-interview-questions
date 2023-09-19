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
    + 标准普通对象（纯粹的对象）  例如：{x:10,y:20}  原型链(__proto__)直接指向Object.prototype
    + 标准特殊对象
      + new Array 数组
      + new RegExp 正则
      + new Date 日期对象
      + new Error 错误对象
      + Set/Map 「ES6+新增的数据结构 」
      + ...
    + 非标准特殊对象  例如：new Number(1) -> 原始值对应的对象数据类型值
    + 函数对象function
*/

//=====================
/*
 创建一个值的办法：
   @1 字面量方式
   @2 构造函数方式 “new” 
 对于对象数据类型来讲，两种方式创造的结果几乎一样，只不过语法上有一些区别！！
 对于原始值类型来讲：
   基于字面量方式创造出来的就是“原始值”类型
   但是基于构造函数方式，创造出来的是一个“实例对象”「也被称之为：非标准特殊对象」
   非标准特殊对象，都具备 [[PrimitiveValue]] 这个属性，存储的是对应的原始值！！
 */

// 如何创建一个非标准特殊对象？
//  1. new 构造函数()
//  只适用于 Number/String/Boolean
//  2. Object([PrimitiveValue])
//  适用于所有原始值
//  null/undefined是没有自己对应的“非标准特殊对象的”

/* 
let num1 = 10;
console.log(num1);
console.log(typeof num1); //'number' 原始值类型的

let num2 = new Number(10);
console.log(num2);
console.log(typeof num2); //'object' 对象类型的 
*/


/*
// 字面量方式
let arr1 = [10, 20];
console.log(arr1);
console.log(typeof arr1); //'object' 对象

// 构造函数方式「NEW」
let arr2 = new Array(10, 20);
console.log(arr2);
console.log(typeof arr2); //'object' 对象

// new Array() 基于构造函数的方式创建一个新数组
//   1. 如果传递一个值，而且是“数字N”，则创建一个长度为N的“稀疏”数组
//      + 稀疏数组：数组中至少有一项是empty（不存在的）
//      + 密集数组：数组中每一项都在，索引是从零连续累增，即便内容是null
//  2. 剩下的情况都是把传递的内容，作为数组中的每一项
console.log(new Array(10)); //[empty*10]
console.log(new Array('10')); //['10']
console.log(new Array(10, 20)); //[10,20]
*/

//=====================
/*
Symbol基本语法：
  创建一个唯一值: Symbol() 或者 Symbol('描述')
  不能被NEW执行，如果想创建其“非标准特殊对象”，则基于 Object(Symbol())
  Object(value)：把value值变为对象类型

啥叫唯一值：
  Symbol('AA')===Symbol('AA')：false
  只要Symbol一执行，就会创建一个唯一值，和是否设置了标识没关系「标识只是想肉眼可见的情况下，进行区分」！！

Symbol作用一：就是想创建一个独一无二的值
Symbol作用二：对象可以设置一个Symbol类型的属性（也是为了保证其唯一性）
   每一个对象都是由零到多组“键值对（键->属性名 值->属性值，也被称作为对象的成员）”组成的
      obj['name'] 操作的俗称：成员访问
   对象的“属性值”可以是任何类型，但是“属性名”只能是字符串或者Symbol类型！
Symbol作用三：JS很多底层处理机制，就是基于Symbol提供的方法实现的
   Symbol.iterator/asyncIterator
   Symbol.hasInstance
   Symbol.toPrimitive
   Symbol.toStringTag
   ...

for/in循环的BUG！
  + 它会去当前对象所有的属性上「含：私有属性和原型链上的公有属性」进行查找
     问题：
     + 我们一般只想迭代私有的，公有的不管
     + 性能很差
  + 只会迭代可枚举的属性「不论属性是公有还是私有」
  + 迭代不了Symbol类型的属性
*/

/* let o = { x: 10 };
// 正常情况下，一个对象的“属性名”，只能是“字符串”类型的；如果不是，则默认转换为字符串！！
let obj = {
  name: 'zhufeng',
  age: 14,
  0: 100,
  true: 200,
  [o]: 300 //等价于 obj[o]=300；再给对象设置属性的时候，如果想把一个变量的值作为属性名，需要用中括号包起来，也就是“基于中括号可以给对象设置动态属性”  => obj['[object Object]']=300
}; */

/* // 但是在ES6后，对象的属性名可以是 symbol 类型的!!
let obj = {
  x: 10,
  [Symbol()]: 200, //把一个Symbol类型的值作为对象的属性名
  [Symbol()]: 300
};
console.log(obj[Symbol()]); */

/* let sy = Symbol('AA');
let obj = {
  x: 10,
  [sy]: 100 //设置唯一属性值
};
console.log(obj[sy]); //100 */

//=====================
// for/in循环：用于迭代对象中的每一项
// 对象的属性，从类型分：字符串、Symbol
// 对象的属性，从特征分：可枚举、不可枚举
//   + 可枚举：可以被for/in循环、Object.keys等迭代的属性；「自定义的属性一般是可枚举的」
//   + 不可枚举：反之；「内置属性一般是不可枚举的」
//   + 我们可以自己修改属性的枚举性「Object.defineProperty 以后会讲」！！
// 我们实战开发中，应该减少对for/in循环的使用!!

/* Object.prototype.AA = 100;
let arr = [10, 20, 30];
arr[Symbol('哈哈')] = 200;
// 我们的需求：只迭代私有属性、不论类型和枚举性
// 思路：想办法获取 “所有” “私有” 属性
let keys = Reflect.ownKeys(arr);
keys.forEach(key => {
  console.log('属性名：', key, '属性值：', arr[key]);
}); */


/* for (let key in arr) {
  console.log(key);
} */

/*
// 解决：不想迭代公有的
for (let key in arr) {
  if (!arr.hasOwnProperty(key)) break; //只要遇到一个公有且可枚举的，就会结束循环；但是没遇到之前，公有的还会被查找！！没有解决性能问题，只是防止公有的被迭代到！！
  console.log(key);
}
*/


/* let arr = new Array(9000000); //稀疏数组「特点：不能基于forEach进行迭代(empty这一项是无法被迭代的)」
arr = arr.fill(null); //对数组每一项进行填充，填充为null，把稀疏数组变为密集数组

// console.time/timeEnd：可以记录一段程序执行需要的时间「预估值：受电脑此时的性能影响」
console.time('FOR');
for (let i = 0; i < arr.length; i++) {
  // ...
}
console.timeEnd('FOR');

console.time('WHILE');
let i = 0;
while (i < arr.length) {
  // ...
  i++;
}
console.timeEnd('WHILE');

console.time('FOR-EACH');
arr.forEach(() => {
  // ...
});
console.timeEnd('FOR-EACH');

console.time('FOR/IN');
for (let key in arr) {
  // ...
}
console.timeEnd('FOR/IN'); */

/* 
// JS中各大迭代方案的性能
// @1 for循环
// @2 while循环
// @3 forEach/map等已经封装好的迭代方法「在这些方法中，也是基于for/while来进行迭代的，而且加入很多判断」
// @4 for/of循环
// @5 for/in循环：比for循环性能消耗多很多很多倍「所以真实开发中，能不用就不用」
let obj = {
  name: 'zhufeng',
  age: 14,
  0: 100,
  x: 200
};
Reflect.ownKeys(obj).forEach(key => {
  console.log(key, obj[key]);
}); 
*/


//=====================
/*
BigInt作用：
  浏览器具备最大/最小安全数字「Number.MAX_SAFE_INTEGER/MIN_SAFE_INTEGER」，超过安全数字进行运算，结果是不一定准确的！！
  服务器端存储的数字也是有长度的限制的「和客户端规则不尽相同」，如果服务器返回一个超大数字(一般都是返回字符串，客户端想要进行计算)；按照之前的规则是不准确的，此时需要基于BigInt处理！！
    1.把服务器返回的字符串，变为BigInt格式{在数字末尾加n}
    2.让BigInt值和另外一个BigInt值进行运算{BigInt值不能和普通数字运算}
    3.把运算的结果返回给后端「也是变为字符串传递进去 String(value)」
 */
/* // 服务器端返回的是："9007199254740991234"
let bigNum = BigInt("9007199254740991234");
console.log(bigNum); //->9007199254740991234n
bigNum = bigNum + 100n;
console.log(bigNum); //->9007199254740991334n
let passValue = String(bigNum);
console.log(passValue); //->"9007199254740991334" */