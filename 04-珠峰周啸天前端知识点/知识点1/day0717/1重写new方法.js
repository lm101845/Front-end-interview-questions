function Dog(name) {
    this.name = name
}
Dog.prototype.bark = function () {
    console.log('wangwang')
}
Dog.prototype.sayName = function () {
    console.log('my name is ' + this.name)
}

const _new = function _new(Ctor, ...params) {
    // Ctor：我们需要操作的构造函数「就是创造它的一个实例」 --> Dog
    // params：数组，存储给 Ctor 传递的实参信息 --> ['三毛']
    // @4 对Ctor要做校验「不能是null/undefined、不能是Symbol/BigInt、必须具备prototype」
    if (Ctor == null || Ctor === Symbol || Ctor === BigInt || !Ctor.prototype) throw new TypeError('Ctor is not a constructor')
    // @1 创建一个空的实例对象「空对象、__proto__指向类的prototype」
    let instance = Object.create(Ctor.prototype)
    // @2 在构造函数作为普通函数执行的时候，让函数中的this指向创建的实例对象
    let result = Ctor.call(instance, ...params)
    // @3 监测函数执行的返回值「返回的是对象，则以函数自己返回的为主，否则返回创建的实例对象」
    if (result !== null && /^(object|function)$/.test(typeof result)) return result
    return instance
}
let sanmao = _new(Dog, '三毛')
sanmao.bark() //"wangwang"
sanmao.sayName() //"my name is 三毛"
console.log(sanmao instanceof Dog) //true 


/* 
// 基于内置的 new 操作符，创造某个类的实例
let sanmao = new Dog('三毛')
sanmao.bark() //"wangwang"
sanmao.sayName() //"my name is 三毛"
console.log(sanmao instanceof Dog) //true 
*/