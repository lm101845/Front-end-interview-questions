/*
typeof数据类型检测的底层机制
  特点1：返回的结果是字符串，字符串中包含了对应的数据类型
    + typeof typeof typeof [1,2,3]
  特点2：按照计算机底层存储的二进制进行检测「效率高」
    + 000 对象
    + 1 整数
    + 010 浮点数
    + 100 字符串
    + 110 布尔
    + 000000… null
    + -2^30 undefined
    + ……
    ------
    typeof按照二进制进行检测的时候，认为以“000”开始的就是对象类型
      + 因为null存储的是64个零，所以被识别为对象，导致：typeof null -> “object”
      + 如果检测出来是对象，再去看是否实现了call方法；如果实现了，说明其是一个函数对象，返回“function”；
      + 如果没有实现call，都返回“object”；
  特点3：typeof null -> “object”
  特点4：typeof 对象 -> “object” && typeof 函数 -> “function”
    + typeof不能检测null，也无法对“对象”进行细分（除函数对象外）
  特点5：typeof 未被声明的变量 -> “undefined”

  typeof在实战中的运用：
    @1 检测除null以外的原始值类型
    @2 笼统的校验是否为对象
    @3 检测是否为函数  => if(typeof obj==="function"){...}
    @4 处理浏览器兼容「ES6+语法规范，都不兼容IE」
       IE浏览器内核：Trident
       Edge浏览器内核：Chromium「虽然都是微软搞的，但是Edge不是IE」
       谷歌浏览器内核：webkit「分支：blink」
       Safari浏览器内核：webkit
       火狐浏览器内核：Gecko
       移动端浏览器 && 国产浏览器：现在基本上都是webkit内核
*/

// 校验是否为对象「包含函数在内的任意对象」
const isObject = function isObject(obj) {
  return obj !== null && /^(object|function)$/.test(typeof obj);
};

// 检验是否为函数
const isFunction = function isFunction(obj) {
  return typeof obj === "function";
};

// 获取一个对象所有的私有属性「含：可枚举和不可枚举、Symbol和字符串类型、需要兼容IE」
//   + Reflect.ownKeys 不兼容IE
const ownKeys = function ownKeys(obj) {
  if (!isObject(obj)) return [];
  let keys = Object.getOwnPropertyNames(obj); //ES5中的方法
  if (typeof Symbol !== "undefined") {
    // 说明此时的浏览器支持Symbol
    keys = keys.concat(Object.getOwnPropertySymbols(obj)); //ES6中的方法
  }
  return keys;
};

/* const ownKeys = function ownKeys(obj) {
  if (!isObject(obj)) return [];
  if (typeof Symbol === "undefined") return Object.getOwnPropertyNames(obj);
  return Reflect.ownKeys(obj);
};  */