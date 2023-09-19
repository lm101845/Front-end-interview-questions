/* setTimeout(() => {
    console.log(1);
}, 20);
console.log(2);
setTimeout(() => {
    console.log(3);
}, 10);
console.log(4);
for (let i = 0; i < 90000000; i++) {
    // do soming
}
console.log(5);
setTimeout(() => {
    console.log(6);
}, 8);
console.log(7);
setTimeout(() => {
    console.log(8);
}, 15);
console.log(9); */


/*
 在 Promise 中，executor函数执行是“同步”的，resolve/reject修改状态和值是“同步”的！！
   .then(onfulfilled,onrejected)
   onfulfilled/onrejected这两个函数的执行是“异步”的！！即便执行then的时候，已经知道了实例的状态，方法也不会立即执行！！
 */
/* let p = new Promise((resolve) => {
    console.log(1);
    resolve(); //立即修改实例的状态为fulfilled
    console.log(2);
});
console.log(3); //在此阶段,p的状态已经是fulfilled
p.then(() => {
    console.log(4);
});
console.log(5);
// 输出是：1 2 3 5 4 */

/* let p = new Promise((resolve) => {
    console.log(1);
    setTimeout(() => {
        console.log(2);
        resolve();
        console.log(3);
    }, 1000);
    console.log(4);
});
console.log(5);
p.then(() => {
    console.log(6);
});
console.log(7);
// 输出是：1 4 5 7 2 3 6 */


/* (async () => {
    console.log(1);
    await Promise.resolve();
    console.log(2);
})();
console.log(3);
// 输出：1 3 2 */


/* 
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function () {
    console.log('setTimeout');
}, 0);
async1();
new Promise(function (resolve) {
    console.log('promise1');
    resolve();
}).then(function () {
    console.log('promise2');
});
console.log('script end'); 
*/

/* 
let body = document.body;
body.addEventListener('click', function () {
    Promise.resolve().then(() => {
        console.log(1);
    });
    console.log(2);
});
body.addEventListener('click', function () {
    Promise.resolve().then(() => {
        console.log(3);
    });
    console.log(4);
}); 
*/