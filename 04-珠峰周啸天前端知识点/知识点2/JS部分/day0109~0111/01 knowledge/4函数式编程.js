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

//========================
/**
 * @name each方法 迭代数组(或对象)中的每一项内容，而且让其支持“中间结束”的操作，而且支持返回值
 * @params 
 *   obj 需要迭代的数组或对象
 *   callback 回调函数；每一次迭代，都会执行这个callback，传递当前迭代项和其索引；如果在callback中返回false，则结束迭代；否则返回啥，就把当前项替换成啥！！
 * @return
 *   返回被替换的结果；原始数据是不改变的！！
 */
const isObject = function isObject(obj) {
  return obj !== null && /^(object|function)$/.test(typeof obj);
};
const isFunction = function isFunction(obj) {
  return typeof obj === "function";
};
// 检测是否为类数组
const isArrayLike = function isArrayLike(obj) {
  let length = !!obj && "length" in obj && obj.length;
  if (isFunction(obj) || obj === window) return false;
  return length === 0 ||
    (typeof length === "number" && length > 0 && (length - 1) in obj);
};
const each = function each(obj, callback) {
  // 如果obj是一个数字类型（而且是有效数字），则创建一个长度和其相同的密集数组
  if (typeof obj === "number" && !isNaN(obj)) obj = new Array(obj).fill(null);
  // 如果传递的数据不是对象类型，则把其转换为对象
  if (!isObject(obj)) obj = Object(obj);
  // 还需要确保callback是一个函数，如果不是则抛出异常错误，阻止下面代码的执行
  if (!isFunction(callback)) throw new TypeError('callback is not a function');
  // 把传递的数组/对象进行克隆「浅克隆」，这样我们只需要修改克隆后的，对原始数据没有影响
  let originObj = obj;
  // 如果传递的值是数组
  if (Array.isArray(obj) || isArrayLike(obj)) {
    obj = [...obj];
    let i = 0,
      len = obj.length,
      result;
    for (; i < len; i++) {
      result = callback.call(originObj, obj[i], i);
      if (result === false) {
        // 结束循环
        break;
      }
      // 用返回的值替换当前项
      obj[i] = result;
    }
    return obj; //把替换后的数组返回
  }
  // 传递的值是一个对象
  obj = { ...obj };
  let keys = Reflect.ownKeys(obj),
    i = 0,
    len = keys.length,
    key,
    result;
  for (; i < len; i++) {
    key = keys[i];
    result = callback.call(originObj, obj[key], key);
    if (result === false) break;
    obj[key] = result;
  }
  return obj;
};

/* each(10, () => {
  console.log('OK');
}); */

/* each("珠峰培训", function (value, key) {
  console.log(value, key, this);
});
 */

/* let arr = [10, 20, 30, 40, 50, 60];
let arr2 = each(arr, (item, index) => {
  console.log(item, index);
  if (index > 2) return false;
  return item * index;
});
console.log('最后处理的结果：', arr2, arr);

let obj = {
  x: 10,
  y: 20,
  [Symbol()]: 30
};
each(obj, (value, key) => {
  if (key === 'y') return false;
  console.log(value, key);
}); */





//========================
// forEach:只能依次迭代、不能中间结束、不支持返回值、不能迭代对象

// let arr = [10, 20, 30, 40];
/* // 函数式编程：把具体的操作步骤封装到一个函数中，我们只需要执行这个函数，就可以得到我们需要的结果「推荐」
arr.forEach((item, index) => {
  console.log(item, index);
}); */

/* // 命令式编程：自己完成和管控执行的步骤
for (let i = 0; i < arr.length; i += 2) {
  if (i > 1) break;
  console.log(arr[i], i);
} */

// 需求：循环五次，处理一些事情
/* new Array(5).fill(null) //创建长度为5的密集数组
  .forEach(() => { //使用函数式编程
    console.log('处理事情');
  }); */