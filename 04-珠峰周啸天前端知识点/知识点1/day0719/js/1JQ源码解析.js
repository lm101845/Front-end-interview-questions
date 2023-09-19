(function (global, factory) {
    "use strict"
    /*
     global：在浏览器&webpack环境下，global是window，在Node环境下，global是Global全局对象/模块
     factory：传递的callback
     */
    if (typeof module === "object" && typeof module.exports === "object") {
        // JQ代码是在支持CommonJS规范「Node&Webpack」的环境下运行
        module.exports = global.document ?
            // 在webpack环境下运行：把 factory 执行的结果，基于 module.exports 导出
            // --> module.exports = jQuery
            // --> const $ = require('jquery')  $就是导出的这个jQuery函数
            factory(global, true) :
            // 在Node环境下运行：JQ是不支持在Node环境下运行的
            // --> const $ = require('jquery')
            // --> $('box')
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            }
    } else {
        // 在浏览器端运行：把factory执行
        // --> <script src='js/jquery.min.js'>
        factory(global)
    }
})(
    typeof window !== "undefined" ? window : this,
    function (window, noGlobal) {
        /*
         进入这里只有两种情况：
           1. 在浏览器下运行 
             window->window对象
             noGlobal->undefined
           2. 在webpack下运行
             window->window对象
             noGlobal->true
         */
        "use strict"

        /* 构造函数 */
        var jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context)
        }
        jQuery.fn = jQuery.prototype = {
            constructor: jQuery,
            // ...
        }

        var init = jQuery.fn.init = function (selector, context, root) {
            // ...
        }
        init.prototype = jQuery.fn


        /* 
         $() / jQuery()  -> 创造 jQuery 类的实例「可以调用 jQuery.prototype 上提供的属性方法」
           问题：它是如何做到，把函数当做普通函数执行（没有带new），最后还创建了自己这个类的一个实例？
           它用到了“工厂设计模式「中转类」”
             + $() 首次创建的是 init 这个类的一个实例
             + init.prototype = jQuery.prototype
             + 创建的实例就相当于 jQuery 类的实例
        */








        /* 暴露API */
        // 对AMD模块化思想的支持
        if (typeof define === "function" && define.amd) {
            define("jquery", [], function () {
                return jQuery
            })
        }

        // 在浏览器下运行
        if (typeof noGlobal === "undefined") {
            window.jQuery = window.$ = jQuery
        }

        // 支持 webpack 基于 module.exports 导出
        return jQuery
    }
)


/* 
let arr = [10, 20, 30]
arr.push(40)
console.log(arr) 
*/

const push = [].push // Array.prototype.push
let arr = [10, 20, 30]
push.call(arr, 40)