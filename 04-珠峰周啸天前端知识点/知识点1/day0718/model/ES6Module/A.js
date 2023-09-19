/* 
 模块导出：export 或者 export default 
 无论基于何种方式，模块导出的永远是一个“Module对象”！！

 第一种方式：export
   + 一个模块中可以使用多次，分别导出多项内容
   + 导出的每一项内容，都是给“Module对象”设置相关的成员
 第二种方式：export default 
   + 一个模块中只能用一次
   + 它是给“Module对象”设置一个叫做default的成员，成员值是导出的内容
*/

/* 在ES6Module的模式下，创建一个JS文件，就相当于创建一个模块，内部编写的代码都是私有的，无需我们自己基于闭包处理 */
export let name = 'A'
export const sum = function sum(...params) {
  return params.reduce((prev, item) => prev + item)
}

export default {
  sum
}





/* export 后面必须放一个创建变量和值的表达式（不能直接放一个值） */
// export sum //错误
// export const x = 10 //正确
// export function fn() { }
// export const obj = {}


/*
// 可以放一个类似于“对象”，类似于“代码块”
// 把大括号中的每一项，作为“Module对象”的成员和对应的值{但是需要这些内容在上面已经声明+定义了}
export {
  sum,
  name,
  // x:10 //错误语法，它不是对象
  // const x=10 //错误语法，它不是代码块
}
*/


/* export default 后面放啥值都可以（但是需要是一个值，不能是创建值的表达式） */
// export default const x = 10 //错误
// export default function(){} //正确
// export default sum //正确
/* export default { //正确
  sum
} */