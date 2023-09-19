/* 
模块导入：把模块导出的“Module对象”中的每一项内容拿到 => import
  import ... from '模块地址'
    + 相对地址
    + 不能省略后缀名「在webpack中可以省略提前配置好的后缀」
  语法一：
    import 变量 from './A.js'
    不是把“Module对象”整体导入进来赋值给“变量”，而是只拿到了“Module对象.default”属性值「变量=Module对象.default」「换句话说，基于export default xxx导出的内容，用这种方式直接导入」
  语法二：
    import {x,y} from './A.js'
    用解构赋值的方式获取导出的内容，首先不是把“Module对象.default属性值”进行解构赋值；而是直接给“Module对象”解构赋值「换句话来讲，它是获取基于 export let xxx=xxx 这种方式导出的内容」
  语法三：
    import * as A from './A.js'
    把模块导出的“Module对象”中的所有内容都拿到，最后赋值给A「A=Module对象」
*/

/* import A from './A.js'
console.log(A) */

/* import { name, sum } from './A.js'
console.log(name, sum) */

/* import * as AA from './A.js'
console.log(AA, AA.default, AA.name) */