/*
 * @Author: liming
 * @Date: 2021-09-02 12:21:44
 * @LastEditTime: 2021-09-02 12:24:54
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\05-手写防抖和节流\01-防抖(debounce)\01.js
 */
/**
 * 函数防抖(debounce)：**短时间内连续**执行某函数时，函数只会被**执行一次**。
 * 例如**Search搜索联想**，用户在不断输入值时，只有最后一次输入才执行联想查询。
 */
var timer;  //维护同一个timer

function debounce(fn, delay) {
    //先清掉之前的定时器
    clearTimeout(timer);
    timer = setTimeout(() => {
        fn()
        //一段时间后才执行这个函数
    },delay)
}