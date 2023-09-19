/* 
继承的目的：让子类的实例，除了具备子类提供的属性方法，还要具备父类提供的属性和方法 
实现继承的方案：
  1. 原型继承「让子类的原型对象指向父类的一个实例」
     Child.prototype = new Parent()
     问题：父类提供的属性和方法，全部都成为子类实例“公有”的属性方法；子类的原型对象被重定向后，丢失了 constructor 属性！！
     特点：原型继承并不是“拷贝式”继承（并不是把父亲的东西copy一份给儿子，而是让儿子基于原型链，找到父亲的方法，再去使用；这样就存在一个隐患，如果儿子基于原型链，把父亲原型上的方法改了，这样对父亲的其他实例也有影响！）

  2. call继承「把父类当做普通函数执行，让函数中的this指向子类的实例」
     function Child() {
        Parent.call(this,...) //this:子类的实例
        ...
     }
     问题：仅仅实现了“把父类私有的属性 继承给了 子类实例的私有属性「有冲突，则以子类为主」”，但是父类公有的方法并没有被子类实例继承过去！！
     特点：它是拷贝式继承

  3. 寄生组合式继承「把call继承和原型继承(变异版)混合在一起」
    function Child() {
        Parent.call(this) 「CALL继承部分：拷贝式继承」
        ...
    }
   「原型继承部分：非拷贝式继承」
    Child.prototype = Object.create(Parent.prototype)
    Child.prototype.constructor = Child
    基于这样的方案，就实现了：父亲私有给了儿子私有，父亲公有给了儿子公有！！

  4. 基于ES6中的class创建类，其自带了继承方案「原理类似于寄生组合式继承」
    class Child extends Parent{
        // 如果没有设置 constructor ，其内部也会默认实现一个“类似 call 继承”：把父类私有的变为子类私有的，只不过不会给父类传递任何实参
        // 如果需要在此处给父类传递实参，则必须写 constructor 函数；但是一旦设置了constructor函数，则在此函数第一行必须执行  super(...) 函数（否则会报错）
        constructor() {
            super(10, 20) //类似于 Parent.call(this,10,20)
            ...
        }
        ...
    }
*/


/* 
继承的目的：让子类继承父类的属性和方法，这样子类的实例，也就拥有这些继承过来的属性和方法了
  + 父类私有的属性方法，变为子类实例私有的属性方法「拷贝」
  + 父类公共的属性方法，子类的实例可以基于 原型链机制 “查找”使用「子类实例.__proto__ -> 子类.prototype -> 父类.prototype -> Object.prototype」
*/
/* class Parent {
  x = 10
  say() { }
}

class Child extends Parent {
  constructor() {
    // 可以不设置 constructor,但是一旦设置，并且基于 extends 实现了继承，那么其第一行一定要执行 super 函数，否则会报错！！
    super()
  }
  y = 20
  jump() { }
}

let c1 = new Child()
console.log(c1)

let c2 = new Child()
console.log(c2) */


// =================
/* function Parent() {
  this.x = 10
}
Parent.prototype.say = function () { }

function Child() {
  this.y = 20
}
// 原型继承：让子类的原型对象指向父类的一个实例
Child.prototype = new Parent()
Child.prototype.jump = function () { }

let c1 = new Child()
console.log(c1)

let c2 = new Child()
console.log(c2)  */



/* function Parent() {
  this.x = 10
}
Parent.prototype.say = function () { }

function Child() {
  // call继承：把父类当做通通函数执行，让函数中的this指向子类的实例
  Parent.call(this)
  this.y = 20
}
Child.prototype.jump = function () { }

let c1 = new Child()
console.log(c1)

let c2 = new Child()
console.log(c2) */



/* function Parent() {
  this.x = 10
}
Parent.prototype.say = function () { }

function Child() {
  // @1 CALL继承：把父类私有的，基于拷贝式，变为子类实例私有的
  Parent.call(this)
  this.y = 20
}
// @2 原型继承：变革一下，不再需要父类私有的东西了，只需要解决公有的即可「只要可以找到父类的原型对象即可」
Child.prototype = Object.create(Parent.prototype)
Child.prototype.jump = function () { }

let c1 = new Child()
console.log(c1)

let c2 = new Child()
console.log(c2) */