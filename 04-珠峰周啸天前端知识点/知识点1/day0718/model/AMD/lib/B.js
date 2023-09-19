define([
    // 直接去找 'lib/A.js'
    'A',
    // ...
], function (A) {
    // A：A模块暴露出来的API对象
    let name = 'B'
    const average = function average(...params) {
        let total = A.sum(...params)
        return (total / params.length).toFixed(2)
    }

    /* 暴露API */
    return {
        average
    }
})