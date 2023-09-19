/*
把其他数据类型转换为Number
  Number([val])
    + 一般用于浏览器的“隐式转换”中
        @1 数学运算
        @2 isNaN检测
        @3 ==比较
        ...
    + 规则：
        @1 字符串转换为数字：空字符串变为0，如果出现任何非有效数字字符，结果都是NaN
        @2 把布尔转换为数字：true->1  false->0
        @3 null->0  undefined->NaN
        @4 Symbol无法转换为数字，会报错：Uncaught TypeError: Cannot convert a Symbol value to a number
        @5 BigInt去除“n”（超过安全数字的，会按照科学计数法处理）
        @6 把对象转换为数字：
          + 先调用对象的 Symbol.toPrimitive 这个方法
            如果不存在这个方法：则继续下一步处理
            如果存在这个方法：则把这个方法执行，传递"number"标识进去
          + 再调用对象的 valueOf 获取原始值
            如果获取的值是原始值：这就是转换的结果
            如果不是原始值，则继续下一步
          + 再调用对象的 toString 把其变为字符串
          + 最后再把字符串基于Number方法转换为数字

  parseInt([val])  parseFloat([val])
    + 一般用于手动转换
    + 规则：[val]值必须是一个字符串，如果不是则先转换为字符串；然后从字符串左侧第一个字符开始找，把找到的有效数字字符最后转换为数字「一个都没找到就是NaN」；遇到一个非有效数字字符，不论后面是否还有有效数字字符，都不再查找了；parseFloat可以多识别一个小数点；
  parseInt([val],[radix])
    从[val]左侧开始进行查找，找到所有符合[radix]进制的内容，然后把其按照[radix]进制转换为10进制！！
    + [radix]是设置的进制，取值有效范围是2~36之间，如果不在有效范围内，结果就是NaN
    + [radix]不写或者设置的为0，默认就是10「特殊情况：如果[val]是以“0x”开始的，则默认值是16」
  把其它进制转10进制？
    + 按“权”展开“求和”

把其他数据类型转换为字符串
  也分为：隐式转换和显示转换
  方法有：String([val]) 或者 [val].toString() 等
  隐式转换使用的都是String([val])这种方式
  ---
  String([val]) 和 [val].toString() 的处理机制是不一样的
  [val].toString()规则：
    @1 基于原型链查找机制，找私有和公有上的toString方法
    @2 把找到的方法执行即可！！-> 如果用的是Object.prototype.toString方法，不是用来转字符串，而是检测数据类型的！！
  String([val])规则：
    @1 对于其它原始值来讲，基本上就是拿字符串包起来
    @2 对象转字符串
      + String(对象)：按照 先找Symbol.toPrimitive -> 再调用valueOf -> 最后调用toString 来处理
  “+”除数学运算，还可能代表的字符串拼接
    + 有两边，一边是字符串，肯定是字符串拼接
    + 有两边，一边是对象，则可能是字符串拼接，还有可能是数学运算
    + 只出现在左边，例如：+"10" 这种方式就是把其它值转换为数字
    + ...

把其他数据类型转换为Boolean
  转换规则：除了“0/NaN/空字符串/null/undefined”五个值是false，其余都是true
  出现情况：
    @1 Boolean([val]) 或者 !/!!
    @2 条件判断
    ...

“==”相等，两边数据类型不同，需要先转为相同类型，然后再进行比较
    @1 对象==字符串  对象转字符串
    @2 null==undefined  -> true   null/undefined和其他任何值都不相等
       null===undefined -> false
    @3 对象==对象  比较的是堆内存地址，地址相同则相等
    @4 NaN!==NaN  NaN和任何值(包含本身)都不相等
    @5 除了以上情况，只要两边类型不一致，剩下的都是转换为数字，然后再进行比较的
“===”绝对相等，如果两边类型不同，则直接是false，不会转换数据类型「推荐」

Object.is([val1],[val2]) 检测两个值是否相等「ES6新增的」
  + 核心用的是“===”
  + 特殊：Object.is(NaN,NaN) => true
*/

//================
// let char = "10101"; //二进制的字符，我们期望把其转为10进制
/*
 从个位开始，每一级的权重分别为：0、1、2...
 展开求和：当前这位数*radix^权重
 1*2^4 + 0*2^3 + 1*2^2 + 0*2^1 + 1*2^0 = 16+0+4+0+1 = 21
*/

// console.log(
//   parseInt("23512px", 4)
// );
/*
 先找到符合4进制的内容：“23”
 最后把“23”作为4进制，转10进制！！
   2*4^1 + 3*4^0 = 8+3 = 11
 */

// 特殊处理
// let arr = [27.2, 0, 0013/*11*/, '14px', 123];
// // 0013会存在8转10的过程 0*8^3+0*8^2+1*8^1+3*8^0 = 11
// // 这样第三项变为  parseInt(11,2) -> parseInt('11',2) -> '11' -> 1*2^1+1*2^0 -> 3
// arr = arr.map(parseInt);
// console.log(arr);

// let arr = [27.2, 0, '0013', '14px', 123];
// arr = arr.map(parseInt);
// console.log(arr);
/*
 迭代数组每一项，每一次迭代把parseInt执行，传递当前项和索引，把处理的结果替换当前项
   parseInt(27.2,0)
    -> parseInt('27.2',10)
    -> 27

   parseInt(0,1)
    -> NaN

   parseInt('0013',2)
    -> '001'
    -> 2进制转10进制  0*2^2 + 0*2^1 + 1*2^0
    -> 1

   parseInt('14px',3)
    -> '1'
    -> 3进制转10进制 1*3^0
    -> 1

   parseInt(123,4)
    -> parseInt('123',4)
    -> '123'
    -> 4进制转10进制  1*4^2 + 2*4^1 + 3*4^0
    -> 27
*/


/*
// 数组有多少项，就要迭代多少轮；
// 每一轮迭代：item是当前项，index是当前项的索引
// 每一轮返回的内容会替换当前项「原数组不变，以新数组返回」
arr.map((item, index) => {
  return ...;
});
*/

//================
// 思路一：本次比较是基于“==”进行比较的，会存在默认的数据类型转换；利用对象转数字，需要经历四个步骤，我们可以重写其中一个步骤「例如：Symbol.toPrimitive、valueOf、toString」，让第一次拆箱结果是1，第二次是2...
/* var a = {
  i: 0
};
a[Symbol.toPrimitive] = function () {
  // this->a
  return ++this.i;
};
// a==1：先要把a进行拆箱，发现a具备Symbol.toPrimitive属性，则把其执行 a[Symbol.toPrimitive]()
if (a == 1 && a == 2 && a == 3) {
  console.log('OK');
} */

/* var a = [1, 2, 3];
a.toString = a.shift;
// a==1:对a进行拆箱  a.toString()等价于a.shift()
if (a == 1 && a == 2 && a == 3) {
  console.log('OK');
} */

// 思路二：对每一次a的访问做访问劫持，获取我们需要的值
/* var i = 0;
Object.defineProperty(window, 'a', {
  get() {
    // 在每一次访问window.a成员的时候都会触发！返回值就是获取的成员值！
    return ++i;
  }
});
if (a == 1 && a == 2 && a == 3) {
  console.log('OK');
} */

//=================
/* “+” 在JS中比较特殊：即可能是字符串拼接，也可能是数学运算 */
// console.log("10" + 10); //"1010"
// console.log(10 + ""); //小技巧：把一个值转换为字符串，可以直接在后面拼一个空字符串即可「隐式转换」

// let arr = [10];
// console.log(arr + 10); //"1010"
/*
 加号有两边，其中一边出现对象，先要把对象拆箱
 1. arr[Symbol.toPrimitive] -> undefined
 2. arr.valueOf() -> [10]
 3. arr.toString() -> '10'
 拆箱中出现字符串了，则按照字符串拼接处理！！
 */

// let time = new Date();
// console.log(time + 1000); //'Tue Jan 10 2023 12:57:12 GMT+0800 (中国标准时间)1000'
/*
 1. time[Symbol.toPrimitive] -> 函数
    time[Symbol.toPrimitive]('default') => 'Tue Jan 10 2023 12:57:44 GMT+0800 (中国标准时间)'
 */

// let num = Object(10);
// console.log(num + 10); //20
/*
 1. num[Symbol.toPrimitive] -> undefined
 2. num.valueOf() -> 10
 10+10 => 20
 */

// // 特殊情况：如果只出现在左边
// let num = "10";
// console.log(Number(num)); //10
// console.log(+num); //10

/*
// i++ 和 i+=1(或i=i+1) 不一样
//  1. i++(或者++i) 一定是数学运算，遇到i不是数字，也要先隐式转为数字，再进行运算
//  2. 但是i+=1可能存在字符串拼接
let x = "10";
x++;
console.log(x); //11

let y = "10";
y += 1; //=>y=y+1
console.log(y); //"101"
*/


//=================
/* 把对象转换为数字，基于Number方法 */

// let obj = { x: 10 };
// console.log(Number(obj)); //NaN
/*
 1. obj[Symbol.toPrimitive] -> undefined  对象中没有这个成员「也就是没有这个属性」
 2. obj.valueOf() -> {x: 10} 不是原始值「只有具备 PrimitveValue 成员的对象，才会获取其原始值」
 3. obj.toString() -> '[object Object]'
 4. NaN
 */

// let arr = [10];
// console.log(Number(arr));
/*
 1. arr[Symbol.toPrimitive] -> undefined
 2. arr.valueOf() -> [10]
 3. arr.toString() -> '10'
 4. 10
 */

// let time = new Date();
// console.log(Number(time));
/*
 1. time[Symbol.toPrimitive] -> 函数
    time[Symbol.toPrimitive]('number') => 1673324691560 时间戳（距离1970/1/1 00:00:00的毫秒差）
      hint标识
      + number 把值转换为数字
      + string 把值转换为字符串
      + default 不是很确定转换为啥，根据情况灵活处理
 */

// let num = 10;
// num = new Number(num); //装箱：把原始值转换为非标准特殊对象
// console.log(Number(num)); //拆箱：把非标准特殊对象转换为原始值
/*
 1. num[Symbol.toPrimitive] -> undefined
 2. num.valueOf() -> 10
 */