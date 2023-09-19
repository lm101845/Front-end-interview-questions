/*
 async/await：简化promise操作的语法糖「promise+generator的语法糖」
   async的作用「修饰函数」：
     + 让函数的返回值变为一个promise实例
       方法执行中遇到await，会等待await的处理结果
       + 方法执行报错，则返回失败的实例，值是报错原因
       + 看方法执行的返回值，如果不是新的实例，则返回的实例是成功，值是返回值；
         如果返回的是一个新的实例，则返回的实例和这个新实例保持同步！！
     + 想要在函数中使用await，则当前函数必须经过async的修饰

   await会等待一个promise的处理结果
     let result = await promise实例
      + await后面必须跟一个promise实例
        await fn() 先执行fn函数，执行的返回值作为await等待的操作
        await 10  如果不是promise实例，则默认转换为状态为成功，值是本身的promise实例 -> await Promsie.resolve(10)
      + 如果后面的实例是成功状态
        result 存储的就是成功的结果
        当前上下文中，await下面代码可以继续执行
      + 如果后面的实例是失败状态，则下面的代码就不会执行了
 */

/*
 第四种：把函数基于 async 修饰，那么其返回值就是一个 promise实例 
   + 函数执行如果报错，则返回状态是 rejected，值是报错原因的实例
   + 如果没有报错，再看函数执行的返回值，如果是一个新的实例，则以新返回的实例为主
   + 如果以上都不是，则返回状态是 fulfilled，值是返回值的实例
 */
/* const fn = async function () {
  return 10
}
fn().then(value => {
  console.log('函数执行的返回值：', value)
}) */

//--------------------------
/* const delay = function delay(interval = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, interval)
  })
} */

/* const fn = async () => {
  console.log(1)
  let res = await delay(2000)
  // 只有await后面的实例是成功，其下面的代码才会执行，res就是成功实例的值
  console.log(2)
}
fn() */

/* // 如果 await 后面的实例是失败的，则await下面的代码就不会执行了，但是因为创建了失败的实例，而且没有做任何的处理，控制台就会抛红；
// 解决方案：把await及要做的事情，基于 try/catch 进行异常捕获即可
const fn = async () => {
  try {
    console.log(1)
    await Promise.reject(0)
    console.log(2) //不会执行
  } catch (_) { 
    // 处理实例是失败的情况 {类似于catch}
  }
  // ... try/catch外面的代码依然可以执行 {类似于finally}
  console.log(3) //会执行
}
fn()  */

// ===> 当代前端开发，处理异步操作，几乎都是基于 Promise 来管理的「告别了传统的回调函数方式」，一但基于 Promise 管理了，使用的时候，一般都会基于 async/await 这套语法糖来操作「以及配合 try/catch 处理成功和失败的各种情况」！！