/*
 Promise：ES6新增的API(构造函数) ，承诺者设计模式
   + 不兼容IE，需要导入 @bable/polyfill 对其进行重写，以此来兼容IE浏览器
   + 基于承诺者模式，有效的去管理异步编程；避免传统上，基于回调函数的方式管理异步编程，所带来的回调地狱问题；尤其是再配合 async/await 语法糖，可以让异步操作看起来和同步一样，管理起来更方便！

 学习Promise的思路：
   1. 学习如何创建 Promise 类的实例
   2. 掌握实例的私有属性，以及相关的作用
   3. 掌握 Promise.prototype 上给实例提供的公共属性和方法
   4. 把 Promise 作为普通对象，其提供的静态私有属性方法
 */
//=========================================================
/*
 第一种：基于 new 来创建 Promise 的实例
   + 不允许把 Promise 作为普通函数执行
     Promise()
     Uncaught TypeError: Promise constructor cannot be invoked without 'new'
   + new Promise 的时候，必须给 Promise 传递一个 executor 函数
     new Promise()
     Uncaught TypeError: Promise resolver xxx is not a function
   ----
   + 关于 executor 函数的一些细节
     + 在 new Promise 的时候，会把传递的 executor 函数“立即”执行「同步的」
     + 不仅把函数执行了，而且还给函数传递了“两个”实参，我们用 resolve/reject 形参接收
       resolve和reject接收的值，都是一个小函数
       + resolve([value]) 立即把实例的状态改为 fulfilled(成功)，值改为 [value]
       + reject([reason]) 立即把实例的状态改为 rejected(失败)，值改为 [reason]
     + 如果 executor 执行中有代码报错，其内部会捕获异常信息（不让其在控制台抛出异常），而是把实例的状态立即改为 rejected(失败)，实例的值是报错原因！！
     + 在 executor 函数中有 Promise 需要管理的异步操作代码
   ----
   + 关于创建出来的、promise实例的一些细节
     + 私有属性
       [[PromiseState]]:"pending"   实例的状态
         + pending 初始状态/准备状态
         + fulfilled 成功状态
         + rejected 失败状态
       [[PromiseResult]]:undefined  实例的值     
     + 实例的状态一但被更改为 fulfilled/rejected，后期就不能再被修改了！
     + 实例状态如果是失败态，而且没有对失败情况做任何的处理，控制台会抛出异常「但是不会影响其他代码的执行」
 */
/* let p1 = new Promise((resolve, reject) => {
  console.log(A)
  // resolve(100)
  // reject(0)
})
console.log(p1.catch(() => { }))
console.log(p1) */

//=========================================================
/*
 创建的 promise实例 可以基于原型链，访问 Promise.prototype 提供的公共属性方法
   + then
   + catch
   + finally
   + Symbol(Symbol.toStringTag) : 'Promise'
   + constructor : Promise

 promise实例.then([onfulfilled],[onrejected])
   要确保 then 中的 this 一定是一个 promise实例
   Uncaught TypeError: Method Promise.prototype.then called on incompatible receiver #<Promise>
   ----
   [onfulfilled]和[onrejected]都是函数
   + [onfulfilled] 当实例状态为成功后执行
   + [onrejected] 当实例状态为失败后执行
   + 都会把实例的值传递给相应的函数
   ----
   同一个实例可以调用多次then方法，也就是会传递多个[onfulfilled]/[onrejected]，当确定实例状态后，所有传递进来的方法，都会被依次被触发执行！！
   ----
   每一次调用 then 方法的时候，其面前的 promise实例，具备三种情况：
     + 实例是成功状态：此时我们直接执行 [onfulfilled] 即可
     + 实例是失败状态：此时我们直接执行 [onrejected] 即可
     + 实例是准备状态：此时我们准备两个数组，分别把传递进来的 [onfulfilled]和[onrejected] 存储起来，当后续实例的状态被更改后，再通知指定数组中的方法执行！！ 
 */

/* let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100)
    // reject(0)
    // console.log(a)
  }, 2000)
})
p1.then(
  value => {
    console.log('成功：', value)
  },
  reason => {
    console.log('失败：', reason)
  }
)
p1.then(
  value => {
    console.log('成功：', value)
  },
  reason => {
    console.log('失败：', reason)
  }
) */

//=========================================================
/*
 第二种：每一次执行 then 方法，会返回一个全新的promise实例（例如：p2）
   p2的状态和值，是由 p1.then 中传递的，不论是 onfulfilled/onrejected 中哪一个方法执行，其执行的细节所决定！
   + 函数执行是否报错，如果报错，则p2是rejected(失败)状态，值是报错原因
   + 看函数执行的返回值是否是一个新的promise实例(例如：@P)，如果是，则@P的状态和值，直接影响了p2的状态和值
     前提：@P和p2不能是相同的实例
   + 如果以上都不是，则p2的状态是fulfilled(成功)状态，值是函数的返回值
   ----
   这样设计的目的是为了实现“then链机制”：可以一直 .then 去调用
   ----
   每一次调用then的时候，onfulfilled/onrejected 是可传可不传的；如果我们不传递，则promise内部会默认设置一个函数，基于此函数实现 状态和值 的向下延续(顺延) => then链中的“穿透机制”
 */

/* let p1 = new Promise((resolve, reject) => {
  resolve(100)
})
let p2 = p1.then(value => {
  console.log('成功：', value)
  return 10
}, reason => {
  console.log('失败：', reason)
})
p2.then(value => {
  console.log('成功：', value)
}, reason => {
  console.log('失败：', reason)
}) */

/* new Promise(resolve => resolve(100))
  .then(value => {
    console.log('成功：', value)
    return value / 10
  }, reason => {
    console.log('失败：', reason)
    return reason * 10
  })
  .then(value => {
    console.log('成功：', value)
    return value / a
  }, reason => {
    console.log('失败：', reason)
    return reason * b
  })
  .then(value => {
    console.log('成功：', value)
    return value / 10
  }, reason => {
    console.log('失败：', reason)
    return reason * 10
  })
  .then(value => {
    console.log('成功：', value)
  }, reason => {
    console.log('失败：', reason)
  }) */

/* // let p1 = new Promise(resolve => resolve(100))
let p1 = new Promise((resolve, reject) => reject(0))
let p2 = p1.then(
  /!* value => {
    return value
  },
  reason => {
    throw reason
  } *!/
)
p2.then(value => {
  console.log('成功：', value)
}, reason => {
  console.log('失败：', reason)
}) */

/*
 实例.catch(onrejected) => 实例.then(null,onrejected)
 我们之前说过，如果实例状态是失败的，而我们没有针对失败的情况做任何的处理，则控制台会抛出红色错误（虽说不影响其它代码的执行，但是看上去不好看）！
 ----
 真实项目中，then方法中，我们只传递 onfulfilled ，在 then 链的末尾，设置 catch，来处理失败的情况！
   + 在任何环节出现失败的实例，根据then的穿透机制，都会顺延至最后的一个catch中执行
 */
/* new Promise((resolve, reject) => resolve(100))
  .then(value => {
    console.log('成功：', value)
    return value / 10·
  })
  .then(value => {
    console.log('成功：', value)
    return new Promise((resolve, reject) => reject(0))
  })
  .then(value => {
    console.log('成功：', value)
    return value / 10
  })
  .catch(reason => {
    console.log('失败：', reason)
  }) */

//=========================================================
/*
 第三种：把 Promise 当做普通对象，基于其提供的静态私有属性方法，来创建 promise实例 
   + Promise.resolve([value])
     立即创建一个状态是 fulfilled，值是 [value] 的实例
     特殊：如果 [value] 是一个新的实例，则这个实例的结果会影响 Promise.resolve 的结果
   + Promsie.reject([reason])
     立即创建一个状态是 rejected，值是 [reason] 的实例
   ----
   + Promise.all/any/race([promises])
     + [promises] 是包含多个 promise实例 的集合「如果集合中有一项不是promise实例，则内部也会把其变为 状态为成功，值就是本身 的实例」
     + 基于三个方法，都会创建一个新的实例（理解为是一个总的实例）,而这个总的实例，是由 [promises] 集合中每一个实例的状态和值来决定的！
       + all：集合中所有实例都是成功的，最后的总实例才是成功的「值是一个数组，按照集合的顺序，依次存储每个实例的值」；但凡有一个实例是失败的，则最后的总实例就是失败的「值是失败项的值」；
       + any：集合中只要有一项是成功的，则总实例就是成功的「值是成功这一项的值」；如果所有项都是失败的，则总实例才是失败的「值是“AggregateError: All promises were rejected”」
       + race：集合中谁最先知道结果，则总实例和其保持一致
 */

/* console.log(Promise.resolve(100)) //成功 100
console.log(Promise.reject(0)) //失败 0
console.log(
  Promise.resolve(Promise.reject(0)) //失败 0
)
console.log(
  Promise.reject(Promise.resolve(100)) //失败 新的实例
) */

/* let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
    // reject(1)
  }, 2000)
})
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
    // reject(2)
  }, 1000)
})
let p3 = Promise.reject(3)
let p4 = 4 //->内部会把其变为一个promise实例：Promise.resolve(4) */

/* Promise.all([p1, p2, p3, p4])
  .then(values => {
    console.log('都是成功态：', values) //[1,2,3,4]
  })
  .catch(reason => {
    console.log('有一项是失败态：', reason)
  }) */

/* Promise.any([p3])
  .then(value => {
    console.log('有一项是成功态：', value) 
  })
  .catch(reason => {
    console.log('所有项都是失败态：', reason)
  }) */

/* Promise.race([p4, p3])
  .then(value => {
    console.log('成功：', value)
  })
  .catch(reason => {
    console.log('失败：', reason)
  }) */