let obj1 = {
    name: '张三',
    age: 25,
    hobby: {
        music: 100,
        jump: 80
    }
}

let obj2 = {
    name: '李四',
    age: 22,
    sex: 0,
    hobby: {
        read: 100,
        music: 90
    }
}

let obj3 = {
    name: '王五',
    age: 20,
    height: '158cm',
    score: {
        math: 100,
        chinese: 90
    }
}

/* // 浅合并
let obj = Object.assign({}, obj1, obj2, obj3)
console.log(obj) */

/* // 深合并
let obj = _.merge({}, obj1, obj2, obj3)
console.log(obj) */

//======================================
/* // 获取当前/指定日期的 “年/月/日 时:分:秒”
console.log(
    new Date().toLocaleString('zh-CN', { hour12: false }),
    new Date('2022-12-24').toLocaleString(),
) */

/*
 proto.isPrototypeOf(obj)
   检测在 obj 的完整的原型链上，是否会出现 proto 这个原型对象
 */

//======================================
/*
 对象的规则设置
   成员的规则：可删除、可修改、可枚举
     + Object.defineProperty
     + Object.getOwnPropertyDescriptor
     + ...
   对象本身的限制：冻结、密封、扩展

 冻结：Object.freeze\Object.isFrozen
   + 现有成员 不能删除、不能修改
   + 不能新增成员
   + 不能基于 defineProperty 进行劫持或者设置规则
 
 密封：Object.seal/Object.isSealed
   + 不能新增成员
   + 不能删除现有的成员
   + 成员的值，之前可以修改，现在还是可以修改的
   + 不能基于 defineProperty 进行劫持或者设置规则

 扩展：Object.preventExtensions/Object.isExtensible
   + 只是限制了不能新增
   + 其余的规则和之前还是一样的「比如：可删除、可修改」
   + 劫持也是可以做的

 对象成员的 configurable 是 false，都不允许基于 defineProperty 进行劫持
 */

/* let obj = {
    x: 10,
    y: 20
}
Object.preventExtensions(obj)
console.log(Object.isExtensible(obj)) //false */


//======================================
/* 
 ES6中提供了 Reflect 对象，其对象中有很多API方法，包含了对象及其成员的常规操作
   + Reflect.ownKeys
   + Reflect.deleteProperty 删除成员，等价于 delete 操作符
   + Reflect.get 成员访问，等价于 obj.xxx
   + Reflect.set 设置成员值，等价于 obj.xxx=xxx
   + Reflect.has 等价于 in 操作符
   + ...
 */