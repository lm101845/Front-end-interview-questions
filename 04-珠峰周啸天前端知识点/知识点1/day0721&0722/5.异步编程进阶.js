/*
 Promise和await中的异步操作 
   Promise中的异步操作：
     基于then传递的 onfulfilled/onrejected 方法的执行是异步的
     + 哪怕执行 then 的时候，已经知道实例的状态和值了，也不会把 onfulfilled/onrejected 立即执行
     + 把其加入到 WebAPI 中监听「只不过已经确定了实例的状态，对应的方法是可以执行的」
     + 紧接着把其放到 EventQueue 的异步微任务队列中 排队等待执行！！
     + 等待同步代码执行完毕，主线程空闲下来了，把异步任务队列中的方法拿出来依次执行...
   await 中的异步操作
     + 遇到 await ，立即把其下面的代码（当前上下文）放到 WebAPI 中监听「异步的微任务」
     + 再看 await 后面的实例是成功还是失败，如果是成功（可能要等一段时间），则说明此 微任务 可以执行，再把其放到 EventQueue 排队等待执行
     + 最后也是同步的都处理完毕了，才会把异步的拿过来处理
 */
/* 
let p1 = new Promise((resolve) => {
    // executor 函数的执行是同步的
    console.log(1)
    resolve(100) // 修改实例的状态和值是同步的
    console.log(2)
})
console.log(3, p1) 
*/

/* let p1 = new Promise(resolve => {
    resolve(100)
})
p1.then(value => {
    console.log('成功：', value)  //@2
})
console.log('OK') //@1 */

/* let p1 = new Promise(resolve => {
    setTimeout(() => {
        console.log(1) //@1
        resolve(100) //立即把实例的状态改为成功，值是100；通知集合中的方法执行的时候，不是让其立即执行，而是异步通知执行！！
        console.log(2) //@2
    }, 2000)
})
p1.then(value => {
    console.log('成功：', value) //@3
}) */

/* const fn = async () => {
    console.log(1) //@1
    await Promise.resolve(0)
    console.log(2) //@3
}
fn()
console.log(3) //@2 */

//======================================

/* async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function () {
    console.log('setTimeout')
}, 0)
async1()
new Promise(function (resolve) {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2')
})
console.log('script end') */

let body = document.body
body.addEventListener('click', function () {
    Promise.resolve().then(() => {
        console.log(1)
    })
    console.log(2)
})
body.addEventListener('click', function () {
    Promise.resolve().then(() => {
        console.log(3)
    })
    console.log(4)
})