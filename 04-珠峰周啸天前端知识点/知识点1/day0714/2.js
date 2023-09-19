/*
 不能每间隔1秒，依次输出0~4 
 原因：
   @1 var 不会产生块级私有上下文，所以声明的 i 是全局变量，等待循环结束的时候，全局的 i 等于5！
   @2 定时器是异步操作，循环是同步操作，等待循环结束，定时器到时间后才会执行！
   @3 当定时间到达时间，设置的 callback 函数执行，输出的 i 不是其内部私有变量，基于作用域链，找到全局上下文中的 i，但是此时的 i 已经是5了！
   => 所以，五个定时器到时间后，输出的结果都是5
 */
/* for (var i = 0; i < 5; i++) {
    setTimeout(function () {
        console.log(i);
    }, (i + 1) * 1000);
} */



/* 
解决方案1：把 var 改为 let 
  + 使用 let 会产生块级私有上下文，而在每一轮产生的 私有的块级上下文 中，会创建一个小函数「callback」，其作用域就是本轮产生的私有上下文，把 callback 赋值给了全局的定时器，所以此 块级上私有下文 不会被释放「也就是闭包」
  + 迭代5轮，产生5个闭包，每个闭包中都有私有变量i，分别存储0~4的值
    第一轮/闭包1：i = 0
    第二轮/闭包2：i = 1
    ...
  + 当定时器到时候，执行 callback 函数的时候，输出的 i 不是 callback 中私有的，则按照作用域链，找到对应的闭包，使用其存储下来的私有 i 的值
  => 这样就实现了：每间隔1秒，分别输出0~4
*/
/* for (let i = 0; i < 5; i++) {
    setTimeout(function () {
        console.log(i);
    }, (i + 1) * 1000);
} */

/* 解决方案2：不基于 let 产生闭包，而是自己把函数执行，让其产生闭包 */
/* for (var i = 0; i < 5; i++) {
    (function (i) {
        setTimeout(function () {
            console.log(i)
        }, (i + 1) * 1000)
    })(i);
} */

/* 解决方案3：基于定时器内部的闭包处理机制 */
/* for (var i = 0; i < 5; i++) {
    setTimeout(
        function (i) {
            console.log(i)
        },
        (i + 1) * 1000,
        // 定时器一但设置第三个及以后的实参，其内部就会产生一个闭包，先把传递的实参值保存下来
        // 当定时器到达时间，执行 callback 函数的时候，会把之前闭包中存储的那些实参值，传递给 callback
        i
    )
} */

//=========================
// let buttons = Array.from(document.querySelectorAll('#box button'))

/* 方案1：基于闭包解决「性能最差」 */
/* for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        console.log('此按钮索引：', i)
    }
} */
/* for (var i = 0; i < buttons.length; i++) {
    (function (i) {
        buttons[i].onclick = function () {
            console.log('此按钮索引：', i)
        }
    })(i);
} */
/* for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = (function (i) {
        return function () {
            console.log('此按钮索引：', i)
        }
    })(i);
} */
/* buttons.forEach((button, index) => {
    button.onclick = function () {
        console.log('此按钮索引：', index)
    }
}) */

/* 方案2：自定义属性 */
/* let i = 0
for (; i < buttons.length; i++) {
    buttons[i].myindex = i
    buttons[i].onclick = function () {
        console.log('此按钮索引：', this.myindex)
    }
} */

/* 方案3：事件委托「比上面的两种方式，性能可以提高 40%~60% 以上」 */
let box = document.querySelector('#box')
box.onclick = function (ev) {
    let target = ev.target,
        targetTag = target.tagName
    if (targetTag === 'BUTTON') {
        console.log('此按钮索引：', target.getAttribute('index'))
    }
}