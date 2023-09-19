/*
 constructor：构造函数「在类默认的原型对象上都具备 constructor 属性，值是当前构造函数本身」
   实例对象.constructor => 获取其隶属的构造函数
   检测数据类型的思路：
     + 获取实例对象的constructor
     + 验证是不是我们要检测类型的构造函数
     + 如果是，则是这个类型的
     + 如果不是，则不是这个类型的
  答案仅供参考！！
 */
let arr = []
console.log(arr.constructor === Array) //如果结果是true，则说明其是一个数组
console.log(arr.constructor === RegExp) //false
console.log(arr.constructor === Object) //false

// 相比较于 instanceof 来讲，原始值其也可以处理
let num = 1
console.log(num.constructor === Number) //true