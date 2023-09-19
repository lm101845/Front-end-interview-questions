(function () {
    "use strict"
    const toString = Object.prototype.toString

    // 万能检测数据类型的办法「返回结果："小写数据类型"」
    const toType = function toType(obj) {
        if (obj === null) return "null"
        let type = typeof obj,
            reg = /^\[object (\w+)\]$/
        if (/^(object|function)$/.test(type)) {
            type = toString.call(obj)
            return reg.exec(type)[1].toLowerCase()
        }
        return type
    }

    // 笼统校验是否为对象
    const isObject = function isObject(obj) {
        return obj !== null && /^(object|function)$/.test(typeof obj)
    }

    // 检测是否为纯粹的对象「标准普通对象」
    const isPlainObject = function isPlainObject(obj) {
        if (obj == null) return false
        if (toString.call(obj) !== '[object Object]') return false
        let proto = Object.getPrototypeOf(obj)
        if (!proto) return true
        let ctor = proto.hasOwnProperty('constructor') && obj.constructor
        return typeof ctor === 'function' && ctor instanceof ctor && ctor === Object
    }

    // 检测是否为函数
    const isFunction = function isFunction(obj) {
        return typeof obj === 'function'
    }

    // 检测是否为window
    const isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window
    }

    // 检测是否为数组或者伪数组
    const isArrayLike = function isArrayLike(obj) {
        let length = !!obj && "length" in obj && obj.length,
            type = toType(obj)
        if (isFunction(obj) || isWindow(obj)) return false
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj
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

    // 延迟函数
    const delay = function delay(interval = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, interval)
        })
    }

    /* 暴露API */
    const utils = {
        toType,
        isFunction,
        isWindow,
        isObject,
        isPlainObject,
        isArrayLike,
        ownKeys,
        def,
        delay
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