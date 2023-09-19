const AModule = (function () {
    let name = 'A'
    const sum = function sum(...params) {
        return params.reduce((prev, item) => prev + item)
    }

    /* 暴露API */
    // window.sum = sum //直接挂载到了全局上「但是不宜暴露太多的内容，否则一样可能会导致全局变量污染」
    return {
        sum
    }
})()