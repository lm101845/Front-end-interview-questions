"use strict"
/* 工具类方法 */
var def = function def(obj, key, value) {
    Object.defineProperty(obj, key, {
        value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}

/* Promise核心代码 */
function Promise(executor) {
    var self = this
    if (!(self instanceof Promise)) throw new TypeError("Promise constructor cannot be invoked without 'new'")
    if (typeof executor !== "function") throw new TypeError("Promise resolver is not a function")
    // 给实例设置私有属性「状态 & 值」
    def(self, 'state', 'pending')
    def(self, 'result', undefined)
    def(self, 'onfulfilledCallback', [])
    def(self, 'onrejectedCallback', [])
    // 修改实例状态和值的方法
    var change = function change(state, result) {
        if (self.state !== "pending") return
        self.state = state
        self.result = result
        // 状态修改完毕，要把之前存储的onfulfilled/onrejected执行「异步通知执行」
        var callbacks = state === 'fulfilled' ? self.onfulfilledCallback : self.onrejectedCallback
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                callback(self.result)
            })
        })
    }
    // 立即执行 executor 函数
    try {
        executor(
            function resolve(value) {
                change('fulfilled', value)
            },
            function reject(reason) {
                change('rejected', reason)
            }
        )
    } catch (err) {
        // 如果 executor 函数执行报错了，则修改实例状态是失败，值是报错的原因
        change('rejected', err)
    }
}

/* Promise.prototype */
var proto = Promise.prototype
def(proto, "then", function then(onfulfilled, onrejected) {
    var self = this
    if (!(self instanceof Promise)) throw new TypeError("Method Promise.prototype.then called on incompatible receiver #<Promise>")
    // 给onfulfilled/onrejected设置默认值
    if (typeof onfulfilled !== 'function') {
        onfulfilled = function onfulfilled(value) {
            return value
        }
    }
    if (typeof onrejected !== 'function') {
        onrejected = function onrejected(reason) {
            throw reason
        }
    }
    // 根据现有实例的状态，做不同的处理
    switch (self.state) {
        case 'fulfilled':
            setTimeout(function () {
                onfulfilled(self.result)
            })
            break
        case 'rejected':
            setTimeout(function () {
                onrejected(self.result)
            })
            break
        default:
            self.onfulfilledCallback.push(onfulfilled)
            self.onrejectedCallback.push(onrejected)
    }
})

/* static Promise */
def(Promise, "all", function all(promises) {
    // 确保promises是一个数组「内置all方法：要求promises必须具备迭代器规范」
    if (!Array.isArray(promises)) throw new TypeError("promises is not a array")
    // 返回一个总的实例
    return new Promise(function (resolve, reject) {
        var count = 0,
            len = promises.length,
            values = []
        // 迭代promises集合中的每一项，根据每一项的状态和值，来决定总实例的状态和值
        for (var i = 0; i < len; i++) {
            (function (i) {
                var promise = promises[i]
                // 如果循环这一项不是实例，则把其变为状态是成功，值是本身的实例
                if (!(promise instanceof Promise)) promise = Promise.resolve(promise)
                promise
                    .then(function (value) {
                        // 只要有一项是成功的，则计数器累加
                        count++
                        values[i] = value
                        // 等待所有项都成功，总实例才是成功的
                        if (count >= len) resolve(values)
                    })
                    .catch(function (reason) {
                        // 只要有一项是失败的，则总实例就是失败的，值就是失败项的值
                        reject(reason)
                    })
            })(i);
        }
    })
})