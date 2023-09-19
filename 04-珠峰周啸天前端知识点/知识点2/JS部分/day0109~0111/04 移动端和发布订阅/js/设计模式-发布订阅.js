/* 
 发布（publish）订阅（subscribe）设计模式
   灵感：参照DOM2事件绑定中的事件池机制，自己构建一套事件池，实现“自定义事件”的绑定、移除、触发、让绑定的方法执行等操作！！
   用途：
     + vue框架中的 $on/$off/$emit 操作，原理就是发布订阅！！
     + react框架中，redux源码中也有一套发布订阅的机制
     + vue2中有一套观察者设计模式，它是发布订阅的“前身”
     + ....
     + 发布订阅的思想：发布一个计划，我们可以随时向计划中订阅要执行的方法「或者移除订阅」，到达某个条件后，只需要通知计划执行，这样就可以把订阅的方法依次执行！！
*/
const sub = (function () {
    /* 创建自定义事件池 */
    let listeners = {};

    /* on:新增绑定 */
    const on = function on(name, handler) {
        // 新增之前，先校验自定义事件是否已经存在，如果不存在，则新创建一个
        if (!listeners.hasOwnProperty(name)) listeners[name] = [];
        let listener = listeners[name];
        // 每一次新增之前需要去重
        if (listener.includes(handler)) return;
        listener.push(handler);
    };

    /* off:移除绑定 */
    const off = function off(name, handler) {
        // 先判断是否存在这个自定义事件
        if (!listeners.hasOwnProperty(name)) return;
        let listener = listeners[name];
        for (let i = 0; i < listener.length; i++) {
            let item = listener[i];
            if (item === handler) {
                // 这一项就是要被移除的
                // listener.splice(i, 1); //这样处理会引发数组塌陷
                listener[i] = null; //这样处理，这一项没有被移除（数组不会塌陷），只是把内容清空了
                break;
            }
        }
    };

    /* emit:通知&传参 */
    const emit = function emit(name, ...params) {
        if (!listeners.hasOwnProperty(name)) return;
        let listener = listeners[name];
        for (let i = 0; i < listener.length; i++) {
            let item = listener[i];
            if (typeof item === "function") {
                item(...params);
                continue;
            }
            // 再次通知执行的时候，如果此项内容不是函数(是null)
            listener.splice(i, 1);
            i--;
        }
    };

    return {
        on,
        off,
        emit
    };
})();


/* const fn1 = (n, m) => {
    console.log('fn1', n, m);
};
const fn2 = (n, m) => {
    console.log('fn2', n, m);
    sub.off('AAA', fn1);
    sub.off('AAA', fn2);
};
const fn3 = () => console.log('fn3');
const fn4 = () => console.log('fn4');
const fn5 = () => console.log('fn5');
const fn6 = () => console.log('fn6');

// 绑定方法
sub.on('AAA', fn1);
sub.on('AAA', fn1);
sub.on('AAA', fn2);
sub.on('AAA', fn3);
sub.on('AAA', fn4);
sub.on('AAA', fn5);
sub.on('AAA', fn6);
sub.on('BBB', fn6);

// 间隔2秒触发执行一次
let n = 0;
let timer = setInterval(() => {
    sub.emit('AAA', 10, 20);
    n++;
    if (n >= 3) clearInterval(timer);
}, 2000); */


/* 
index.js 入口
   setTimeout(()=>{
     //页面加载的2秒后，处理的事情：通知auto自定义事件触发即可
     sub.emit('auto');
   },2000);
  
kunkun.js
  const showAdvert=function showAdvert(){ ... };
  sub.on('auto',showAdvert);

hanbing.js
  const autoPlay=function autoPlay(){ ... };
  sub.on('auto',autoPlay);

xiaofeng.js
  const consoleLog=function consoleLog(){ ... };
  sub.on('auto',consoleLog);
*/