/*
 * @Author: liming
 * @Date: 2021-09-02 13:12:50
 * @LastEditTime: 2021-09-02 13:14:00
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\06-变量提升07.js
 */
let a = 1;
{
  // 初始化前无法访问“a”，在这里的a指的是下面的a，不是全局的a，此时a还没有被初始化，
  //所以在这里log会报错，因为在这里是暂时性死区
  // console.log(a);

  let a;
  //解释器进入包含let variable语句的块范围的情况。变量立即通过声明阶段，在范围内注册其名称,
  //然后解释器继续逐行解析块语句。

  console.log("########## - a", a); //初始化，对其进行访问的结果为undefined
  a = "被重新赋值了";
  console.log("========= - a", a);

  console.log("########## - b", b);
  var b;
  b = "b";
  console.log("========= - b", b);
}
console.log("全局的a", a);
console.log("全局的b", b);