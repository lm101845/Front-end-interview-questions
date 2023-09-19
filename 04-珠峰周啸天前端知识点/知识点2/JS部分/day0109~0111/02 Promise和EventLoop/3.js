/* 
 async/await：是promise+generator的语法糖
   + 它是ES8中新增的“语法”
   + 简化promise的应用操作

 async：用来修饰一个函数的
   + 让函数的返回值是一个promise实例
     首先看方法执行是否报错，如果报错，则返回状态为失败的实例，值是报错原因
     如果不报错，再看返回的结果是否为一个新的实例，如果是一个新的实例，则新实例的状态和值决定了函数返回实例的状态和值！
     否则就是返回状态为成功，值是return返回值的实例
   + 平时开发中，使用async修饰函数，主要目的：想在函数中使用await！
 
 await：等待并监听promise实例的状态和值的
   let result = await [promise实例];
   + 必须应用在“基于async修饰的函数中”
   + await后面跟的是一个promise实例，如果不是，则默认转换为状态为fulfilled，值是本身的实例
     await 10;
     ->
     await Promise.resolve(10);
   + await会监测后面实例的状态
     + 如果实例的状态是fulfilled，则把实例的值赋值给result
     + 当前函数体中,await下面的代码会继续执行
     + 如果实例的状态是rejected，则下面代码不会再执行了
     + 如果实例的状态是pending，则进行等待和监听
 */

/* const fn1 = async () => {
    return 10;
};
console.log(fn1()); //promise: fulfilled 10 */

/* const fn1 = async () => {
    await Promise.resolve(100);
    return 10;
};
console.log(fn1()); //等待await处理完毕 promise: fulfilled 10 */

/* const fn1 = async () => {
    await Promise.reject(100);
    return 10;
};
console.log(fn1()); //等待await处理完毕 promise: rejected 100 */

/* const fn1 = async () => {
    try {
        await Promise.reject(100);
        // ...
    } catch (_) { }
    // 只要做了异常捕获，则下面代码还会继续执行
    return 10;
};
console.log(fn1()); //等待await处理完毕 promise: fulfilled 10 */


// Promise语法中：可以基于THEN(onfulfilled)，处理状态为成功做的事情；基于CATCH(onrejected)处理状态为失败时候做的事情！！
// await语法中：如果实例是成功的，则会把await下面的代码执行（类似于onfulfilled）；但是如果实例是失败的，默认是啥都不处理的(此时控制台会抛“红”) 
// await异常捕获：就是在监测的实例是失败状态下，想去处理一些事情 => try/catch
/* (async function () {
    try {
        await Promise.reject(0);
        console.log('OK');
    } catch (err) {
        console.log('await后面实例的状态是失败的：', err);
    }
})(); */


/* // 编写代码延迟执行的函数
const delay = function delay(interval = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
};
// 接下来可以基于await实现等待执行的效果
(async function () {
    console.log(1);
    await delay();
    console.log(2);
    await delay();
    console.log(3);
    await delay();
    console.log(4);
})(); */

/* (async () => {
    await 10;
    //...
})(); */

/* const fn = async () => {
    return 10;
};
console.log(fn()); //promise实例：状态fulfilled 值10 */

/* const fn = () => {
    return 10;
};
console.log(fn()); //10 */