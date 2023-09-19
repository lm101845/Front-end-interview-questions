/* 
    在函数式编程当中有一个很重要的概念就是函数组合， 实际上就是把处理数据的函数像管道一样连接起来， 然后让数据穿过管道得到最终的结果。 例如：
    const add1 = (x) => x + 1
    const mul3 = (x) => x * 3
    const div2 = (x) => x / 2
    div2(mul3(add1(add1(0)))) //=>3
​
    而这样的写法可读性明显太差了，我们可以构建一个compose函数，它接受任意多个函数作为参数（这些函数都只接受一个参数），然后compose返回的也是一个函数，达到以下的效果：
    const operate = compose(div2, mul3, add1, add1)
    operate(0) //=>相当于div2(mul3(add1(add1(0)))) 
    operate(2) //=>相当于div2(mul3(add1(add1(2))))
​
    简而言之：compose可以把类似于f(g(h(x)))这种写法简化成compose(f, g, h)(x)，请你完成 compose函数的编写 
*/
const add1 = x => x + 1
const mul3 = x => x * 3
const div2 = x => x / 2

/* // funcs：存储执行 compose 的时候，传递进来的，后续需要执行的函数「数组集合」
const compose = function compose(...funcs) {
    // x：第一个函数执行的初始实参值
    return function operate(x) {
        let len = funcs.length
        if (len === 0) return x
        if (len === 1) return funcs[0](x)
        // 倒着迭代传递的函数集合，把每一个函数依次执行
        for (let i = len - 1; i >= 0; i--) {
            const func = funcs[i]
            // 把函数执行，把x做为实参传递进去，接收返回值，修改x的值，做为下一轮迭代中，函数执行的实参
            x = func(x)
        }
        return x
    }
} */


// 解决方案一
const compose = function compose(...funcs) {
    return function operate(x) {
        let len = funcs.length
        if (len === 0) return x
        if (len === 1) return funcs[0](x)
        return funcs.reduceRight((prev, func) => func(prev), x)
    }
} 

/* // 解决方案二：redux中提供的compose函数
const compose = function compose(...funcs) {
    if (funcs.length === 0) return arg => arg
    if (funcs.length === 1) return funcs[0]
    return funcs.reduce((a, b) => {
        return x => {
            return a(b(x))
        }
    })
} */
console.log(compose()(0)) //0
console.log(compose(add1)(0)) //1
console.log(compose(mul3, add1)(0)) //3
console.log(compose(div2, mul3, add1, add1)(0)) //3


/*
 数组中的 9 大迭代方法
   支持 callback ，迭代数组中的每一项，每迭代一次，都会把 callback 执行一次...
   callback 中会接收到 item:当前迭代项  index:当前迭代项的索引
   原始数组都不会改变
   + forEach
   + map
   + filter 按条件「callback返回的结果（true/false）」进行筛选，把符合条件的放在新的数组中
   +ES6 find 按条件查找数组中的“某一项”「即便多项符合条件，查找到的只有第一项」
   +ES6 findIndex 按条件查找数组中“某一项的索引”
   + some 验证数组中的“某一项”是否符合条件，只要有一项符合条件，some执行的结果就是true「something」
   + every 验证数组中的“所有项”是否符合条件，只有所有项否符合条件，every执行的结果才是true「everyone」
   + reduce/reduceRight 依次迭代数组每一项(reduceRight是反着迭代)，但是其可以把上一次 callback 处理的结果，传递到下一个 callback 执行中，这样可以实现结果的“累计”！
 */
// let arr = [10, 20, 30, 40, 50]

// 需求：按条件筛选需要的内容
/* let res = arr.filter((item, index) => {
    return item > 30
})
console.log(res) //[40, 50] */

// 需求：删除30这一项
/* let index = arr.indexOf(30)
arr.splice(index, 1)
console.log(arr) */
/* arr = arr.filter(item => item !== 30)
console.log(arr) */

/* let arr = [{
    name: '张三',
    age: 25
}, {
    name: '李四',
    age: 27
}, {
    name: '王五',
    age: 22
}]
console.log(
    arr.some(item => item.age >= 30)
) //false */


// let arr = [10, 20, 30, 40, 50]
/* let res = arr.reduce((prev, item, index) => {
    /!*
     第一轮  prev=10 item=20 index=1 ->30「把数组第一项作为prev的初始值，数组从第二项开始迭代」
     第二轮  prev=30 item=30 index=2 ->60「prev获取的是上一轮callback执行的返回值」
     第三轮  prev=60 item=40 index=3 ->100
     第四轮  prev=100 item=50 index=4 ->150
     迭代结束，最后一轮处理的结果，会作为reduce函数的总返回值
     *!/
    return prev + item
})
console.log(res) */

/* let res = arr.reduce((prev, item, index) => {
    /!*
    第一轮  prev=100 item=10 index=0 ->110「数组从第一项开始迭代」
    ....
    *!/
    return prev + item
}, 100) //第二个参数就是再给第一轮迭代的prev赋值初始值 */