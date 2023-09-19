/*
 Object.assign(obj1,obj2,obj3,...) 实现多个对象之间的合并/替换
    + 用 obj2 中的每一项替换 obj1「obj1被更改」
    + 再用 obj3 中的每一项替换被更改后的 obj1 「obj1有被修改了」
    + ...
    + 最后修改的是obj1，assign 返回的也是 obj1 的内存地址
 
 obj2替换obj1
   + 1和2都有的，以2为主
   + 1有2没有的，保留1的内容
   + 1没有2有的，给1中新设置这个成员
 */
/* 
let obj1 = {
    x: 10,
    y: 20
}
let obj2 = {
    x: 100,
    m: 30
}
let obj3 = {
    x: 1000,
    n: 40
}
let obj = Object.assign(obj1, obj2, obj3)
console.log(obj) //{ x: 1000, y: 20, m: 30, n: 40 }
console.log(obj1) //{ x: 1000, y: 20, m: 30, n: 40 }
console.log(obj1 === obj) //true
console.log(obj2, obj3) //没有更改过 
*/

/* 
// Object.assign 采用的是浅比较/浅合并
let obj1 = {
    x: 10,
    y: {
        n: 20
    }
}
let obj2 = {
    z: 30,
    y: {
        m: 1000
    }
}
Object.assign(obj1, obj2)
console.log(obj1) // { x: 10, y: { m: 1000 }, z: 30 } 
*/

/* 
// 实现 obj2 替换 obj1，但是不想修改 obj1 的内容「想实现对象的合并，但是不想改变任意一个对象，想返回一个新对象即可」
let obj1 = {
    x: 10,
    y: 20
}
let obj2 = {
    x: 100,
    m: 30
}
let obj = Object.assign({}, obj1, obj2)
console.log(obj, obj1, obj2) 
*/

//=============================
/*
 数组/对象的拷贝(克隆)
   数组的浅拷贝
     + arr.slice()
     + [...arr]
     + arr.concat()
     + 迭代赋值
     + Object.assign([],arr)
     + ...
   对象的浅拷贝
     + { ...obj }
     + Object.assign({}, obj)
     + 迭代对象每一项，赋值给新对象
     + ...
  浅拷贝的特点：原始对象（A）和拷贝后的新对象（B），首先是不同的堆内存，只是第一级的内容相同，但是A和B会共用第二级及更深层级的内存，没有实现完全断开联系...
 */
/* 
let obj1 = {
    x: 10,
    y: {
        z: 20
    }
}
// let obj2 = { ...obj1 }
// let obj2 = Object.assign({}, obj1)
/!* let obj2 = {}
Reflect.ownKeys(obj1).forEach(key => {
    obj2[key] = obj1[key]
}) *!/
console.log(obj1, obj2)
console.log(obj2 === obj1) //fasle
console.log(obj2.y === obj1.y) //true  
*/

/* 
let arr1 = [10, [20, 30, [40, 50]]]
// let arr2 = arr1.slice()
// let arr2 = [...arr1]
// let arr2 = arr1.concat()
/!* let arr2 = []
arr1.forEach(item => {
    arr2.push(item)
}) *!/
let arr2 = Object.assign([], arr1)
console.log(arr2 === arr1) //fasle
console.log(arr2[1] === arr1[1]) //true  
*/

//=============================
/*
 但是真实项目中，往往需要的不是浅拷贝，而是深拷贝，让拷贝后的对象和原来的对象彻底断开联系 
   浅拷贝：只拷贝第一级
   深拷贝：所有级别都需要拷贝，拷贝成全新的内存空间（只不过内容一样）
 ----
 深拷贝的方案： 
   @1 基于 JSON 对象中的方法进行处理
     + 先基于 JSON.stringify 把原来的对象变为“json字符串”
     + 然后再基于 JSON.parse 把“json字符串”变为对象「此时会重新开辟“所有”需要的内存空间」
   @2 基于循环和递归，一层层的进行拷贝
 */
/* 
let obj1 = {
    x: 10,
    y: [1, 2, { z: 3 }],
    m: {
        n: 20,
        k: {
            p: 30
        }
    }
}
let obj2 = JSON.parse(JSON.stringify(obj1))
console.log(obj2)
console.log(obj2 === obj1) //false
console.log(obj2.m === obj1.m) //false
console.log(obj2.m.k === obj1.m.k) //false
console.log(obj2.y === obj1.y) //false
console.log(obj2.y[2] === obj1.y[2]) //false 
*/


/*
 但是 JSON 这种方案存在弊端（在基于 stringify 把对象变为字符串的时候）：
   + 无法处理 BigInt 类型的值
   + 属性名是 symbol 类型，或者属性值是 undefined、symbol、function 类型的，都自动消失了
   + 属性值是 正则/Error 的实例，都自动变为 {}
   + 日期对象变为字符串后，再基于 parse 处理的时候，回不到对象格式了
   + 不支持对象的“套娃”操作
 也就是JSON这种方案，只能用于处理：属性名是字符串、属性值是“数字、字符串、布尔、null、普通对象、数组对象”、而且没有套娃操作...这样的情况！！
 */

let obj = {
    name: '珠峰',
    age: 13,
    bool: true,
    n: null,
    u: undefined,
    sym: Symbol('sym'),
    big: 10n,
    list: [10, 20, { a: 100, b: 200 }],
    reg: /\d+/,
    time: new Date,
    err: new Error('xxx'),
    ke: { js: '基础课', web: '高级课', arr: [1000, 2000] },
    [Symbol('KEY')]: 100,
    fn: function () { }
}
obj.obj = obj

let newObj = _.cloneDeep(obj)
console.log(newObj)
console.log(newObj === obj)
console.log(newObj.ke.arr === obj.ke.arr)