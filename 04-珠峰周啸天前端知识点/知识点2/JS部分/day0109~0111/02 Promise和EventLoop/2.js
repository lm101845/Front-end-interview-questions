/*
 第四种创建promise实例的方案：Promise.all/any/race()
   let p = Promise.all([p1,p2,p3,p4...])
     + 执行Promise.all，必须传递一个符合“迭代器规范iterator”的集合「例如：数组」
     + 集合中包含零到多个promise实例
       特殊：如果其中某一项不是promise实例，则默认会把其转换为状态是fulfilled,值是本身的实例
       Promise.all([p1,100,p3])：100不是promise实例，则内部默认会把其转换为 Promise.resolve(100)
     + all方法会监听集合中所有的实例
       + 只要有一个实例状态是rejected，则基于all创建的总实例p，其状态也是失败的，值是失败的原因
       + 只有所有实例状态都是fulfilled，则p才是成功，值也是一个数组集合，按顺序存储每一个实例成功的结果

   any：只要有一个成功，整体就是成功(值是这一项成功的结果)，所有的都失败，整体才是失败(值是一句话:"所有都失败了！(英文 AggregateError: All promises were rejected)")
   race：谁先处理完，那么整体状态/值就和谁一致！！
 */

/* let p1 = new Promise(resolve => {
    setTimeout(() => {
        resolve(1);
    }, 2000);
});
let p2 = new Promise(resolve => {
    setTimeout(() => {
        resolve(2);
    }, 1000);
});
let p3 = 3; //=>默认转 p3=Promise.resolve(3)
let p4 = Promise.resolve(4);

Promise.all([p1, p2, p3, p4])
    .then(values => {
        console.log('成功：', values);
    }).catch(reason => {
        console.log('失败：', reason);
    }); */

/* Promise.any([p4])
    .then(values => {
        console.log('成功：', values);
    }).catch(reason => {
        console.log('失败：', reason);
    }); */

//======================================
/*
 promise.then(onfulfilled,onrejected)
   + onfulfilled/onrejected 可以写函数，也可以不写(或者写null/undefined)
   + 在不编写这两个方法的情况下，THEN具备“穿透(顺延)”机制：顺延至下一个then中，相同状态对应的方法上，把其执行（实例的值也被顺延下来了）！！
 */
/* Promise.reject(100)
    .then()
    .then(value => {
        console.log('成功:', value);
    }, reason => {
        console.log('失败:', reason);
    }); */

/* // 真实开发中:我们在then中一般只写onfulfilled的处理;在THEN链的末尾,设置onrejected的处理！！
// @1 这样处理后，then里面只处理成功的情况；不论哪一个环节出现了失败的状态，都顺延至最后一个onrejected中进行处理即可！！「我们最后会用catch处理：.catch(onrejected) 等价于 .then(null,onrejected)」
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        let ran = Math.random();
        ran > 0.5 ? resolve(ran) : reject(ran);
    }, 1000);
});
p.then(value => {
    console.log('成功:', value);
    return value * 10;
}).then(value => {
    console.log('成功:', value);
    return value * 10;
}).then(value => {
    console.log('成功:', value);
    return value * 10;
}).catch(reason => {
    console.log('失败:', reason);
}).finally(() => {
    // 不论成功还是失败，最后都会执行
    console.log('finally「几乎不用」');
}); */

//======================================
// 立即创建一个 状态:fulfilled 值:100 的实例
/* let p = new Promise((resolve, reject) => {
    resolve(100);
    // reject(0); //如果把实例的状态改为失败，而没有在then中设置onrejected，则控制台会抛“红”，但是不影响其它代码的执行，所以建议大家对失败的情况尽可能的做处理！！
}); */

// 创建一个实例，但是得1000MS后才能知道其状态 -> 状态:fulfilled 值:100
/* let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(100);
    }, 1000);
}); */



/*
 第二种创建Promise实例的方案：每一次执行then方法，会返回一个全新的promise实例！！
   这样可以保证，一个.then结束后，可以继续.then，实现出“THEN链机制”
   let p2 = p1.then([onfulfilled],[onrejected]);
     p2的状态和值，取决于onfulfilled或者onrejected中的任何一个方法执行所决定！！
       + 首先看方法执行是否报错
         报错：则p2的状态就是失败的(rejected)，值是报错原因
         不报错：则继续往后看
       + 其次再看方法执行的返回值，是否为一个新的promise实例“起名：@P”
         @P是新的实例：则@P这个新实例的状态和值，决定了p2的状态和值
         @P不是新的实例：则继续
       + 最后走到这一步，p2的状态就是成功的(fulfilled)，值是上一个函数返回的值！！
 */
/* let p1 = new Promise((resolve, reject) => {
    resolve(100);
});
let p2 = p1.then(
    (value) => {
        console.log('成功:', value);
        return Promise.reject(0);
    },
    (reason) => {
        console.log('失败:', reason);
    }
);
let p3 = p2.then(
    (value) => {
        console.log('成功:', value);
    },
    (reason) => {
        console.log('失败:', reason);
    }
);
console.log(p3); */

/* Promise.resolve(10)
    .then(value => {
        console.log('成功:', value);
        return Promise.reject(value / 10);
    }, reason => {
        console.log('失败:', reason);
        return reason * 10;
    })
    .then(value => {
        console.log('成功:', value);
        return value * 10;
    }, reason => {
        console.log('失败:', reason);
        return Promise.resolve(reason / 10);
    })
    .then(value => {
        console.log('成功:', value);
        return value / 10;
    }, reason => {
        console.log('失败:', reason);
        return reason * a;
    })
    .then(value => {
        console.log('成功:', value);
        return Promise.reject(value - 10);
    }, reason => {
        console.log('失败:', reason);
        return Promise.resolve(reason + 10);
    })
    .then(value => {
        console.log('成功:', value);
    }, reason => {
        console.log('失败:', reason);
    }); */

//======================================
// Promise() //Uncaught TypeError: Promise constructor cannot be invoked without 'new' 不能当做普通函数执行，必须被new执行！！
// let p = new Promise(); //Uncaught TypeError: Promise resolver undefined is not a function 基于new执行的时候，必须传递一个函数「executor」！！

/*
 第一种创建promise实例，及修改实例状态和值的方案！
    let p = new Promise([executor:resolve/reject])
      + 我们基于resolve或reject执行，修改实例的状态和值
      + executor执行报错，也会把实例的状态改为rejected，值改为报错原因
 */
/* let p = new Promise(
    (resolve, reject) => {
        console.log(a);
        resolve(100);
    }
);
console.log(p);
console.log('OK'); */

/* console.log(a); 
//控制台会抛出异常,后续代码都不会再执行  Uncaught ReferenceError: a is not defined
console.log('OK'); */

/* try {
    // 尝试执行的代码
    console.log(a);
} catch (err) {
    // 如果有报错，不会在控制台抛出异常，我们这里进行了“异常捕获「try/catch」”
    console.log('错误：', err); //err中存储报错的信息，后续的代码可以继续执行！！
}
console.log('OK'); */


/* let p = new Promise((resolve, reject) => {
    // 通常我们会在executor函数中，编写异步操作代码；在异步操作结束的时候，基于结果来修改实例的状态和值！
    setTimeout(() => {
        resolve(100);
    }, 2000);
});
p.then(
    // 当实例为成功执行的方法
    () => { },
    // 当实例为失败执行的方法
    () => { }
); */