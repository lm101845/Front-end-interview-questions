(function () {
    "use strict"
    // 检测是否为函数
    const isFunction = function isFunction(obj) {
        return typeof obj === 'function'
    }

    // 笼统校验是否为对象
    const isObject = function isObject(obj) {
        return obj !== null && /^(object|function)$/.test(typeof obj)
    }

    // 获取对象所有私有成员「兼容到IE、不受枚举和类型的限制」
    const ownKeys = function ownKeys(obj) {
        if (!isObject(obj)) throw new TypeError('传递的obj不是一个对象')
        let keys = Object.getOwnPropertyNames(obj)
        if (typeof Symbol !== 'undefined') {
            keys = keys.concat(Object.getOwnPropertySymbols(obj))
        }
        return keys
    }

    // 给对象新增一个“不可枚举”的成员
    const def = function def(obj, key, value) {
        Object.defineProperty(obj, key, {
            value,
            writable: true,
            configurable: true,
            enumerable: false
        })
    }

    /* 暴露API */
    const utils = {
        isFunction,
        isObject,
        ownKeys,
        def
    }
    if (typeof define === "function" && define.amd) {
        define("utils", [], function () {
            return utils
        })
    }
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = utils
    }
    if (typeof window !== 'undefined') {
        window.utils = window._ = utils
    }
})()