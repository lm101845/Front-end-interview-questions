(function (global, factory) {
    /*
     global:
       在浏览器和webpack环境中运行JQ: global->window
       在node环境中运行JQ：global->模块对象
     factory:
       传递的函数
     */
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        // 支持CommonJS规范
        //   webpack:global是window，global.document存在，把factory执行，把执行的返回结果，基于module.exports模块规范导出！！
        //   node:global是this，global.document不存在，我们导出一个函数(和factory没关系)，后期执行导出的这个函数，如果依然无法提供window对象，则报错「总结：node环境不支持JQ」
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        // 不支持CommonJS规范，例如：在浏览器中运行JQ
        factory(global);
    }
})(
    typeof window !== "undefined" ? window : this,
    // JQ的核心代码
    function factory(window, noGlobal) {
        /*
         浏览器中运行JQ：window->window  noGlobal->undefined
         webpack中运行JQ：window->window  noGlobal->true  方法执行的返回值被导出使用
         */

        "use strict";
        // jQuery是一个类
        var jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context);
        };

        // 给jQuery类的原型对象上，设置供实例调用的公有属性方法 
        // jQuery.fn是设置的一个别名，代表原型对象
        jQuery.fn = jQuery.prototype = {
            constructor: jQuery,
            get() { },
            eq() { },
            // ...
        };

        // 把JQ当做一个普通对象，为其设置的“静态私有属性方法”：jQuery.xxx()
        jQuery.extend = function () { };
        // 在JQ的原型对象上设置方法，供实例调用：实例.xxx()
        jQuery.fn.extend = function () { };

        var rootjQuery = jQuery(document),
            rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
            init = jQuery.fn.init = function (selector, context, root) {
                var match, elem;

                // HANDLE: $(""), $(null), $(undefined), $(false)
                if (!selector) {
                    return this;
                }

                // Method init() accepts an alternate rootjQuery
                // so migrate can support jQuery.sub (gh-2101)
                root = root || rootjQuery;

                // Handle HTML strings
                if (typeof selector === "string") {
                    if (selector[0] === "<" &&
                        selector[selector.length - 1] === ">" &&
                        selector.length >= 3) {

                        // Assume that strings that start and end with <> are HTML and skip the regex check
                        match = [null, selector, null];

                    } else {
                        match = rquickExpr.exec(selector);
                    }

                    // Match html or make sure no context is specified for #id
                    if (match && (match[1] || !context)) {

                        // HANDLE: $(html) -> $(array)
                        if (match[1]) {
                            context = context instanceof jQuery ? context[0] : context;

                            // Option to run scripts is true for back-compat
                            // Intentionally let the error be thrown if parseHTML is not present
                            jQuery.merge(this, jQuery.parseHTML(
                                match[1],
                                context && context.nodeType ? context.ownerDocument || context : document,
                                true
                            ));

                            // HANDLE: $(html, props)
                            if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                                for (match in context) {

                                    // Properties of context are called as methods if possible
                                    if (isFunction(this[match])) {
                                        this[match](context[match]);

                                        // ...and otherwise set as attributes
                                    } else {
                                        this.attr(match, context[match]);
                                    }
                                }
                            }

                            return this;

                            // HANDLE: $(#id)
                        } else {
                            elem = document.getElementById(match[2]);

                            if (elem) {

                                // Inject the element directly into the jQuery object
                                this[0] = elem;
                                this.length = 1;
                            }
                            return this;
                        }

                        // HANDLE: $(expr, $(...))
                    } else if (!context || context.jquery) {
                        return (context || root).find(selector);

                        // HANDLE: $(expr, context)
                        // (which is just equivalent to: $(context).find(expr)
                    } else {
                        return this.constructor(context).find(selector);
                    }

                    // HANDLE: $(DOMElement)
                } else if (selector.nodeType) {
                    this[0] = selector;
                    this.length = 1;
                    return this;

                    // HANDLE: $(function)
                    // Shortcut for document ready
                } else if (isFunction(selector)) {
                    return root.ready !== undefined ?
                        root.ready(selector) :

                        // Execute immediately if ready is not present
                        selector(jQuery);
                }

                return jQuery.makeArray(selector, this);
            };
        init.prototype = jQuery.fn;

        /* 暴露API：后续我们使用的时候，$->jQuery，$()就是把jQuery执行，$.ajax()就是调用jQuery的静态私有属性方法去执行 */
        if (typeof noGlobal === "undefined") {
            window.jQuery = window.$ = jQuery;
        }
        return jQuery;
    }
);

/*
 总结：
   JQ中，$()是创建init类的实例，但是因为init.prototype指向jQuery.fn，所以创建的实例也是jQuery的实例
   --> $() JQ的选择器，就是为了创建JQ实例对象的！！这样就可以调用jQuery.fn上的方法使用了！！ 「操作DOM」
   --> $.xxx() 直接调用静态私有方法执行（和实例没关系） 「工具方法」

 这样处理实现了：作为普通函数执行「不带new」，也可能会创建其一个实例对象，只不过需要基于第三方类中转一下，这样的处理思想，也被称之为“工厂设计模式”！！
 */

// let $box = $('.box');
// $box.css({});
// $box.addClass('active');

/* 
 可以运行JS的环境：
   1. 浏览器「webview」
     + 存在window全局对象
     + 不支持CommonJS模块规范「module.exports」
   2. Node
     + 没有window，用global/this来代表全局对象(或模块对象)
     + 支持CommonJS模块规范
   3. webpack：基于node对代码进行打包，打包后的代码交给浏览器使用
     + 存在window全局对象
     + 支持CommonJS模块规范
*/