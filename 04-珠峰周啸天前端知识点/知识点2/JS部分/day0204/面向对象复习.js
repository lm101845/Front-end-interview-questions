/* function Fn(x, y) {
    let total = x + y;
    this.x = x;
    this.y = y;
}
Fn.prototype.sum = function sum() {
    console.log(this.x + this.y);
};

let res = Fn(10, 20); //普通函数执行
console.log(res);

let f1 = new Fn(10, 20); //构造函数执行：Fn类(构造函数) f1实例
console.log(f1); */

function Dog(name) {
    this.name = name;
}
Dog.prototype.bark = function () {
    console.log('wangwang');
}
Dog.prototype.sayName = function () {
    console.log('my name is ' + this.name);
}

/** 
 * _new：对内置new的重写，实现出和其类似的效果
 *   ctor:要创建实例的构造函数(类)
 *   params:数组，存储了给ctor函数传递的实参
 */
/* function _new(ctor, ...params) {
    // ctor->Dog  params->['三毛']
    // @1 创建一个空的实例对象
    let obj = {};
    obj.__proto__ = ctor.prototype;
    // @2 把函数执行，但是需要让里面的this指向创建的实例对象
    let result = ctor.call(obj, ...params);
    // @3 分析函数的返回值，从而决定最后返回实例还是其它
    if (result !== null && /^(object|function)$/.test(typeof result)) return result;
    return obj;
} */

function _new(ctor, ...params) {
    let result,
        obj;
    // 校验ctor的类型
    if (typeof ctor !== "function" || !ctor.prototype || ctor === Symbol || ctor === BigInt) throw new TypeError('ctor is not a constructor');
    obj = Object.create(ctor.prototype);
    result = ctor.call(obj, ...params);
    if (result !== null && /^(object|function)$/.test(typeof result)) return result;
    return obj;
}
let sanmao = _new(Dog, '三毛');
sanmao.bark(); //=>"wangwang"
sanmao.sayName(); //=>"my name is 三毛"
console.log(sanmao instanceof Dog); //=>true