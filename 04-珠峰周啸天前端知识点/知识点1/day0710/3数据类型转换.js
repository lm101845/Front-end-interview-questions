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
        @4 Symbol无法转换为数字，会报错：Cannot convert a Symbol value to a number
        @5 BigInt去除“n”（超过安全数字的会丢失精准度；再长的数字，会按照科学计数法处理）
        @6 把对象转换为数字：
          + 先调用对象的 Symbol.toPrimitive 这个方法，如果不存在这个方法
          + 再调用对象的 valueOf 获取原始值，如果获取的值不是原始值
          + 再调用对象的 toString 把其变为字符串
          + 最后再把字符串基于Number方法转换为数字
  parseInt([val])  parseFloat([val])
    + 一般用于手动转换
    + 规则：[val]值必须是一个字符串，如果不是则先转换为字符串；然后从字符串左侧第一个字符开始找，把找到的有效数字字符最后转换为数字「一个都没找到就是NaN」；遇到一个非有效数字字符，不论后面是否还有有效数字字符，都不再查找了；parseFloat可以多识别一个小数点；
  parseInt([val],[radix])
    从[val]左侧开始进行查找，找到所有符合[radix]进制的内容，然后把其按照[radix]进制转换为10进制！！
    + [radix]是设置的进制，取值有效范围是2~36之间，如果不在有效范围内，结果就是NaN
    + [radix]不写或者设置的为0，默认就是10「特殊情况：如果[val]是以“0x”开始的，则默认值是16」


把其他数据类型转换为String
  转化规则：
    @1 拿字符串包起来
    @2 对象转字符串
      + String(对象)：按照 先找Symbol.toPrimitive -> 再看valueOf -> 最后toString 来处理
      + 对象.toString()：直接转换为字符串
      + 特殊：Object.prototype.toString，是用来检测数据类型的
  出现情况：
    @1 String([val]) 或者 [val].toString()
    @2 “+”除数学运算，还可能代表的字符串拼接
        + 有两边，一边是字符串，肯定是字符串拼接
        + 有两边，一边是对象，则可能是字符串拼接，还有可能是数学运算
        + 只出现在左边，例如：+"10" 这种方式就是把其它值转换为数字
        + ...
    ...


把其他数据类型转换为Boolean
  转换规则：除了“0/NaN/空字符串/null/undefined”五个值是false，其余都是true
  出现情况：
    @1 Boolean([val]) 或者 !/!!
    @2 条件判断
    ...


“==”相等，两边数据类型不同，需要先转为相同类型，然后再进行比较
    @1 对象==字符串  对象转字符串「Symbol.toPrimitive -> valueOf -> toString」
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

/* let obj = { x: 10 }
// obj[Symbol.toPrimitive] --> undefined 不具备这个方法
// obj['valueOf']() --> {x: 10} 结果不是原始值
// obj['toString']() --> '[object Object]'  Object.prototype.toString
// Number('[object Object]') --> NaN
console.log(Number(obj)) */

/* let arr = [10]
// arr[Symbol.toPrimitive] --> undefined 不具备这个方法
// arr['valueOf']() --> [10] 结果不是原始值
// arr['toString']() --> '10'  Array.prototype.toString
// Number('10') --> 10
console.log(Number(arr)) */

/* let time = new Date()
// time[Symbol.toPrimitive] --> 在Date.prototype上有Symbol.toPrimitive这个函数
// 具备这个函数，则把这个函数直接执行「可以传递的值：'number'、'string'、'default'」
// time[Symbol.toPrimitive]('number') --> 1689154535927「时间戳：距离1970/01/01 00:00:00之间的毫秒差」
console.log(Number(time)) */

/* let num = new Number(10)
// num[Symbol.toPrimitive] --> undefined 不具备这个方法
// num['valueOf']() --> 10
console.log(Number(num)) */

//===================================
/* 面试题1 */

// 思路一：利用“==”比较会转换数据类型，如果a是一个对象，每一次和数字比较，都会基于 Number 把a先转为数字，再进行比较，而基于Number把对象转数字，会检测对象的 Symbol.toPrimitive、valueOf、toString，只要我们把这三个中的任意一个方法重写，让其执行的时候，分别返回 1/2/3 即可！！
/* var a = {
  i: 0
}
a[Symbol.toPrimitive] = function () {
  // this->a
  return ++this.i
}
if (a == 1 && a == 2 && a == 3) {
  console.log('OK')
} */

/* var a = [1, 2, 3]
a.toString = a.shift
if (a == 1 && a == 2 && a == 3) {
  console.log('OK')
} */

// 思路二：在全局上下文中，基于 var 声明变量，是给 window 设置一个新的成员；当我们访问 a 的时候，是获取 window.a 的值；既然这样，我们就可以基于 Object.defineProperty 给 window 对象中的 a 这个成员，做数据劫持「get/set」！
/* var i = 0
Object.defineProperty(window, 'a', {
  get() {
    return ++i
  }
})
if (a == 1 && a == 2 && a == 3) {
  console.log('OK')
}
 */


/*
 Object.defineProperty(obj,key,{
    get(){},
    set(){}
 })
 作用2：给对象中的某个成员设置劫持函数，在获取和设置成员值的时候，不会去操作堆内存，而是走劫持函数处理
*/
/* let obj = {
  name: '哈哈哈'
}
Object.defineProperty(obj, 'name', {
  configurable: true,
  // writable: true, //设置劫持函数后，writable和value这两个规则就不允许设置了
  enumerable: true,
  get() {
    // 访问对象的这个成员时，就会触发get这个函数，函数的返回值，就是获取的成员值
    console.log('GET劫持函数')
    return '呵呵呵'
  },
  set(val) {
    // 当修改对象的这个成员值的时候，先触发set这个函数，val就是要修改的值
    console.log('SET劫持函数', val)
  }
}) */



//===================================
/* 
console.log(parseInt('1324')) //->parseInt('1324',10)  =>1324
console.log(parseInt('1324', 4)) //->'132' 把找到内容的作为4进制，转换为10进制
// 把其它进制转换为10进制：按权展开求和
// 个位权重0  十位权重1  百位权重2 ...
// 1*4^2 + 3*4^1 + 2*4^0
// 16 + 12 + 2
// 30 

let arr = [10, 20, 30, 40]
arr = arr.map((item, index) => {
  // 数组中有几项，就把callback执行几次，并且传递item/index
  // 接收callback的返回值，替换数组当前这一项「原数组不变」
  return item * index
})
console.log(arr)
*/

/* 面试题2 */
// let arr = [27.2, 0, '0013', '14px', 123]
// arr = arr.map(parseInt)
/* 
 第一轮迭代：parseInt(27.2,0)
   parseInt('27.2',10)
   + 查找符合10进制的内容 '27'
   + 把其按照10进制转换为10进制 27
 第二轮迭代：parseInt(0,1)
   + NaN 因为没有1进制
 第三轮迭代：parseInt('0013',2)
   + 查找符合2进制的内容 '001'
   + 把其按照2进制转换为10进制
     0*2^2+0*2^1+1*2^0
 第四轮迭代：parseInt('14px',3)
   + 查找符合3进制的内容 '1'
   + 把其按照3进制转换为10进制
     1*3^0
 第五轮迭代：parseInt(123,4)
   parseInt('123',4)
   + 查找符合4进制的内容 '123'
   + 把其按照4进制转换为10进制
     1*4^2+2*4^1+3*4^0
     16+8+3
 */
// console.log(arr) //[27,NaN,1,1,27]

/* 
parseInt(0013,2)
// 浏览器认为只要以0开始的“数字”，默认都是8进制的，需要隐式转换为10进制的数字
// 0013 -> 8转10
// 0*8^3+0*8^2+1*8^1+3*8^0 => 11
parseInt(11,2)
// 找到符合2进制的内容 -> '11'
// 在把2进制转为10进制  1*2^1+1*2^0 => 3 
*/


//===================================
/* 
面试题3 
  + 不论是整数还是小数(浮点数)，在计算机底层都是按照 2 进制进行存储的
  + 拓展：把10进制的数字转换为2进制
     整数：除以2，取其余数，然后用商值继续除以2，直到商值变为0，最后把所有余数倒过来拼接
     浮点数：乘以2，取整数部分，直到取整后，变为0
    整数变为2进制不会出现无限循环的情况，但是浮点数是很容易出现的，而计算底层存储的2进制值，最多64位，所以对于浮点数来讲，很可能存储值的时候，就已经丢失了精准度！！
*/
/* console.log(0.1 + 0.2 === 0.3) //false
// 浮点数的运算，可能会导致最后的结果出现很长的小数点位数「精准度丢失」
// 0.1 + 0.2 = 0.30000000000000004 */

/* let num = 16
console.log(num.toString()) //'16'
console.log(num.toString(2)) //把10进制的数字，转换为指定radix进制的字符串 '10000' */

/* let num = 0.4
console.log(num.toString(2)) //'0.01100110011001100110011001100110011001100110011001101' */

// 问题：如何解决浮点数计算不精准的问题
/* // 方案1：基于toFixed保留小数点位数（一般两位）「自带四舍五入的机制」
let num = 0.1 + 0.2
console.log(+num.toFixed(2) === 0.3) //true */

// // 方案2：让计算的浮点数，乘以统一的系数（系数需要按照最大的来，其目的是把浮点数变为整数），最后再除以系数
// let num = 0.1 * 10 + 0.2 * 10
// console.log(num / 10 === 0.3) //true