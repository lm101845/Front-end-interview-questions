/**
 * @name Promise是ES6新增的内置类 不兼容IE「可以基于babel处理兼容」、它是一个构造函数
 * @description promise主要是为了对“异步编程”进行有效的管理，避免“回调地狱”！以后真实项目中，但凡遇到异步操作，我们几乎都是基于 Promise/Async/Await 进行管理的！！“基于承诺者设计模式，有效管理异步代码”！
 * @doc https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * 
 * 如何学习Promise基础知识？
 *   @1 学习创建实例，和实例的私有属性「实例.xxx」
 *     new Promise([executor函数])
 *     [[PromiseState]]: "pending"  还有哪些状态？状态/值咋修改？
 *     [[PromiseResult]]: undefined
 *   @2 学习Promise.prototype上的公共方法「实例.xxx()」
 *     then
 *     catch
 *     finally
 *     Symbol(Symbol.toStringTag): "Promise"
 *   @3 把Promise当做一个普通对象，学习其静态私有属性和方法「Promise.xxx()」
 *     all
 *     any
 *     race
 *     reject
 *     resolve
 */

/*
 真实项目中的“ajax/axios/fetch/跨域”等请求，都是异步操作！！ 
   + ajax并行：同时发送多个异步请求，多个请求之间没有任何的依赖，谁先获取到数据，先处理谁即可！！
        但是偶尔我们会有进阶的需求：等待多个请求都成功，做一些事情！！
   + ajax串行：请求之间有依赖，需要上一个请求完成，才能发送下一个请求
 */

/* 
 传统异步处理方案：基于“回调函数callback”的方式来管理异步编程 
   例如：jQuery中的ajax请求
      $.ajax({
        url:'./package.json',
        method:'GET',
        success(data){
            // success就是传递给$ajax的回调函数，在异步请求结束后，把success函数执行，data就是从服务器获取的信息！我们把获取信息后要做的事情，就写在这个回调函数中！！
        }
      })
 */
/* const ajaxQuery = function ajaxQuery(url, callback) {
    // url:请求的地址  
    // callback:异步请求成功后,我们需要做的事情
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url);
    xhr.onreadystatechange = () => {
        let { readyState, status, responseText } = xhr;
        if (readyState === 4 && status === 200) {
            let data = JSON.parse(responseText);
            //从服务器获取的信息,我们把其转换为JSON对象,把回调函数执行
            callback(data);
        }
    };
    xhr.send();
};
ajaxQuery('./package.json', (data) => {
    console.log('请求成功:', data);
    console.log('OK');
}); */


/* 
// 模拟三个请求的并行
let num = 0;
const complete = () => {
    num++;
    if (num >= 3) {
        console.log('三个请求都完毕');
    }
};
$.ajax({
    url: '/api/A',
    success(data) {
        console.log('第一个请求成功', data);
        complete();
    }
});
$.ajax({
    url: '/api/B',
    success(data) {
        console.log('第二个请求成功', data);
        complete();
    }
});
$.ajax({
    url: '/api/C',
    success(data) {
        console.log('第三个请求成功', data);
        complete();
    }
}); 
*/

/* 
// 模拟三个请求的串行
$.ajax({
    url: '/api/A',
    success(data) {
        console.log('第一个请求成功', data);

        $.ajax({
            url: '/api/B',
            success(data) {
                console.log('第二个请求成功', data);

                $.ajax({
                    url: '/api/C',
                    success(data) {
                        console.log('第三个请求成功', data);
                    }
                });
            }
        });
    }
}); 
*/

// 所以我们期望，有一套更好的“异步管理”方案，可以避免回调函数方案导致的回调地狱问题 => 设计模式：承诺者模式(也就是所谓的Promise模式)！！所有的设计模式，都是一种思想：更好管理代码的思想「锦上添花」！！

// 基于定时器，模拟出ajax获取数据的异步操作
const query = (interval = 1000) => {
    return new Promise(resolve => {
        // 设置定时器模拟数据请求
        setTimeout(() => {
            resolve(`@@${interval}@@`); //相当于从服务器获取数据了，获取的结果是 @@等待时间@@
        }, interval);
    });
};

/* 
// 三个请求的并行{外加都成功做啥事}
let p1 = query(1000).then(value => {
    console.log('第一个请求成功：', value);
});
let p2 = query(2000).then(value => {
    console.log('第二个请求成功：', value);
});
let p3 = query(3000).then(value => {
    console.log('第三个请求成功：', value);
});
Promise.all([p1, p2, p3]).then(() => {
    console.log('三个请求都成功');
}); 
*/

/* 
// 三个请求的串行
query(1000)
    .then(value => {
        console.log('第一个请求成功：', value);
        return query(2000);
    })
    .then(value => {
        console.log('第二个请求成功：', value);
        return query(3000);
    })
    .then(value => {
        console.log('第三个请求成功：', value);
    }); 
*/

/* (async function () {
    let val1 = await query(1000);
    console.log('第一个请求成功：', val1);

    let val2 = await query(2000);
    console.log('第二个请求成功：', val2);

    let val3 = await query(3000);
    console.log('第三个请求成功：', val3);
})(); */