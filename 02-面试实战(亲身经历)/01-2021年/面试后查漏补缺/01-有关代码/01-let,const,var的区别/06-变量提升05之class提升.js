/*
 * @Author: liming
 * @Date: 2021-09-02 11:21:24
 * @LastEditTime: 2021-09-02 11:21:45
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\01-let,const,var的区别\06-变量提升05之class提升.js
 */

let peter = new Person('Peter', 25) // ReferenceError: Person is not defined

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

let John = new Person('John', 25); 
console.log(John) // Person { name: 'John', age: 25 }