/* 
 单例设计模式
   + 最早的模块化开发解决方案
   + 首先基于“闭包”避免了全局变量的污染
   + 再基于“命名空间/模块名”的方式，把闭包中的某些方法暴露出来，供其他模块调用

 const 命名空间=(function(){
    // 本模块下需要编写的程序
    ....

    return {
        // 需要暴露给外部调用的方法
        ...
    }
 })()
 命名空间.xxx()  // 后面的执行都基于命名空间的成员访问方式处理

 弊端：在创建的模块变多的时候，因为模块之间存在“依赖”，所以需要“手动分析”模块之间的依赖，按照顺序，依次在页面中导入对应的模块「这个工作很“恶心”」
 ==> AMD模块化思想「插件：require.min.js，其内部提供了“模块依赖管理”的机制
*/

console.log(AModule.sum(10, 20, 30, 40))
console.log(BModule.average(10, 20, 30, 40))