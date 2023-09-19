/*
  define([依赖的模块],function(用形参接收依赖的模块){
    写本模块中的代码
    return {
        把本模块中需要供外部调用的方法导出
    }
  })
 */
define(function () {
  let name = 'A'
  const sum = function sum(...params) {
    return params.reduce((prev, item) => prev + item)
  }

  /* 暴露API */
  return {
    sum
  }
})