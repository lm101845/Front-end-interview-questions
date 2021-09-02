/*
 * @Author: liming
 * @Date: 2021-09-02 11:33:16
 * @LastEditTime: 2021-09-02 11:35:37
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\06-变量提升06.js
 */
function person(status) {
  if (status) {
    //let value = "蛙人"; //ReferenceError: value is not defined
    var value = "蛙人";
  } else {
    console.log(value); // undefined
  }
  console.log(value); // undefined
}
person(false);

/**
 * 上面example中，if代码块中的var声明的变量就被提升到了函数的顶端，有的小伙伴就会疑惑了，if代码块里的都没执行，怎么会提升到顶端了呢？，这是因为javaScript引擎，在代码预编译时，javaScript引擎会自动将所有代码里面的var关键字声明的语句都会提升到当前作用域的顶端, 因此上面的代码就会被解析为下面。

作者：蛙人
链接：https://juejin.cn/post/6925641096152399880
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */
