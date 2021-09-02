# Javascript 中 ReferenceError 和 TypeError 的区别

> https://zhuanlan.zhihu.com/p/350523720

在调试 JavaScript 的代码时，最常见的两种错误类型便是 ReferenceError 和 TypeError。不过他们又有什么区别呢？这篇文章会进行一下探讨。

**ReferenceError：**

相较于TypeError，ReferenceError 其实更容易被理解，他的错误就是字面意思，引用错误。这意味着在尝试引用一个不存在当前作用域中的变量/常量时产生的错误。

```js
let a = b; // ReferenceError，因为 b 未被定义
console.log(c) // ReferenceError，因为 c 未被定义
```

**TypeError：**

TypeError 会发生在值的类型不符合预期时。换句话说，在对值的操作方法不存在或并未正确的定义时，TypeError 就会被返回。

```js
let a; // a = undefined
console.log(a.b) // TypeError,无法从 undefined 这个类型上读取属性

let c = 1;
console.log(c()) // TypeError，c并不是一个函数
```

