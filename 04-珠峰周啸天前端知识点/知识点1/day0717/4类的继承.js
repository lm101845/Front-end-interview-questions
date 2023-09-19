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
 在面向对象中，有一个非常重要的思想概念：类的继承、封装、多态 
   封装：低耦合高内聚「我们常用的插件/组件/类库/框架，基本上都是基于“面向对象思想”封装的，因为OOP思想，可以有效的实现私有和公有之间的管理」
   多态：本意是让函数具备多种形态
     后端java
       public void handle(){...}
       public void handle(int x){...} 
       public void handle(int x,string type){...} 
       handle(10,'AA')
       handle(10)
       handle()
       handle(10,20) //报错
     前端js「没有严格意义上的多态」
       function handle(){}
       function handle(x){}
       function handle(x,type){}  //只会保留最后一个函数{函数内部可以基于传参不同，做不同的事情}
   继承：子类继承父类的属性和方法「私有&公有」
 */

/*
// 基于ES5的语法来处理 
function Parent(x = 100) {
  // 作为普通函数执行，就是给 window 设置的属性和方法
  // 作为构造函数执行，this是实例，则是给实例设置的 私有属性和方法
  this.x = x
  this.z = 10
}
// 在 Parent.prototype 上设置的内容，只和构造函数执行，创建出来的实例相关，实例可以基于原型链，找到所属类原型对象上的公共属性和方法！！ -> 实例.say()
Parent.prototype.index = 0
Parent.prototype.say = function say() { }
// 下面是把函数当做最普通的对象，设置的静态私有属性方法，和普通函数执行、构造函数执行(类/实例)没有任何的关系，想操作，只能基于成员访问的方式！！ ->  Parent.handleTotal()
Parent.total = 1000
Parent.handleTotal = function handleTotal() { } 
*/

class Parent {
  // 在此大括号中（或此环境中），其this是当前类的实例

  /* 构造函数体部分 */
  // 构造函数体「每一次NEW，都会执行constructor函数（可以不写，只有需要接收传递的实参信息，才必须要设置此函数），我们可以在此函数中，接收传递的实参信息，并且给实例设置私有属性/方法」
  constructor(x = 100) {
    this.x = x
  }
  // 这样设置，和在 constructor 中设置 this.z = 10 是一样的，都是给实例设置私有属性
  z = 10
  sum = function () {
    // 这样设置，this是谁是不确定的
    //   p.sum() this->p
    //   const aa=p.sum  aa()  this->window
    console.log(this)
  }
  sum2 = () => {
    // 这样可以保证this永远都是构造函数的实例
    console.log(this)
  }

  /* 原型对象部分 */
  // 设置的函数本身是不可枚举的 & 没有 prototype 属性
  // 在大括号中给原型上设置内容，只能设置函数，而且必须这样写；如果想设置公有的属性，只能自己基于 Parent.prototype 在外部加了！！
  say() { }
  // sum = function sum() { } //这样就是在设置私有的方法

  /* 静态私有属性方法 */
  static total = 1000
  static handleTotal() { }
  static tool = () => { }
}
Parent.prototype.index = 0
let p = new Parent(20)

// @1 基于 class 创建的是“构造函数”，只能基于 NEW 来执行，不能作为普通函数执行
// Parent() //Uncaught TypeError: Class constructor Parent cannot be invoked without 'new'



// 扩展知识：基于ES5创建的函数，既可以当做普通函数执行，也可以当做构造函数执行，但是我们想让其和 class 一致，只能基于 new 执行！
/* function Fn() {
  // ES6新增 new.target：存储被NEW的构造函数本身「如果不是基于NEW执行，则存储的值是undefined」
  if (!new.target) throw new TypeError('constructor Fn cannot be invoked without new')
  console.log('Fn')
}
let f = new Fn() //可以执行
Fn.call(f) //报错
Fn() //报错 */

/* function Fn() {
  // 基于这样的操作，可以保证Fn构造函数体中的this是Fn类的实例，但不一定非是NEW执行的，也可能是基于call等强制改变了函数中的this指向！！
  if (!(this instanceof Fn)) throw new TypeError('constructor Fn cannot be invoked without new')
  console.log('Fn')
}
let f = new Fn() //可以执行
Fn.call(f) //可以执行
Fn() //报错 */
