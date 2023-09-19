/* 导入模块 */
const A = require('./A')

let name = 'B'
const average = function average(...params) {
    let total = A.sum(...params)
    return (total / params.length).toFixed(2)
}

/* 暴露API */
module.exports = average