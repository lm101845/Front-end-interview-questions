const BModule = (function () {
    let name = 'B'
    const average = function average(...params) {
        let total = AModule.sum(...params)
        return (total / params.length).toFixed(2)
    }
    /* 暴露API */
    return {
        average
    }
})()