/* 创建一个新的模块「无需自己写闭包，A模块下的代码本身就是私有的」 */
let name = 'A'
const sum = function sum(...params) {
    return params.reduce((prev, item) => prev + item)
}

/* 暴露API */
// module.exports = sum //只需要暴露一个
module.exports = {
    sum
}