/* 需求：编写一个 delay 延迟函数，执行 delay 函数，可以把我们要做的事情延迟一段时间执行 */
/* // 解决方案1：基于“回调函数”的方式来管理
const delay = function delay(interval, callback) {
  // 处理参数
  if (typeof interval === 'function') {
    callback = interval
    interval = 1000
  }
  if (typeof callback !== 'function') throw new TypeError('callback is not a function')
  interval = +interval
  if (isNaN(interval)) interval = 1000
  // 设置定时器，把callback延迟执行
  setTimeout(() => {
    callback()
  }, interval)
} */


/* // 并行操作：先后(类似于同时)设置三个定时器，谁先到先执行谁
// 特点：三件事之间没有任何的关联/依赖
// => 'B'/'C'/'A'  三件事都执行完毕需要 3000ms
const complete = function complete() {
  console.log('并行操作都处理完毕了')
}
let n = 0, num = 3
delay(3000, () => {
  console.log('A')
  n++
  if (n >= num) complete()
})
delay(() => {
  console.log('B')
  n++
  if (n >= num) complete()
})
delay(2000, () => {
  console.log('C')
  n++
  if (n >= num) complete()
}) */


/* // 如果三件事有关联，例如：必须先处理A，A处理的结果会作为B处理的条件...也就是执行的顺序必须是 A->B->C
// 串行操作：必须在上一个处理完毕后，才能设置下一个定时器，因为三个的执行是有关联和依赖的
delay(3000, () => {
  console.log('A')
  delay(() => {
    console.log('B')
    delay(2000, () => {
      console.log('C')
    })
  })
}) */

/*
"回调地狱"：基于回调函数的方式来管理异步操作，在“并行”操作中没啥太大的问题，但是在“串行”操作中，会引发“在回调函数中，嵌套回调函数...”，这就是回调地狱！！
  + 基于一层层嵌套的方式，代码太“恶心”了，不利于开发和维护
*/

//=====================================
/*
需求：在项目中，有三个接口请求(串行请求)，现在需要我们分别调用三个接口，完成数据的获取和绑定
  接口1：/api/info  ->  {id:xxx,....}
  接口2：/api/ranking?id=xxx  -> {rank:27}
  接口3：/api/prize?rank=27

在真实的工作中，我们用到的ajax请求“全部都是异步操作（虽然它支持同步的处理）”
  Ajax并行：同时发送多个异步请求，谁先从服务器获取数据，就先处理谁
    特殊情况：都处理完毕后，做统一的一些事情
  Ajax串行：多个请求之间有依赖，需要依次发送「上一个请求结束，才能发送下一个请求」
*/

/* 
JQ：$.ajax 基于回调函数的方式，来管理ajax异步请求的 
  $.ajax({
    url:'',
    method:'GET',
    data:{
      // 传参信息
    },
    dataType:'json', //把从服务器获取的数据，转换为对象
    ...,
    success(result){
      // 请求成功的回调函数「result：从服务器获取的数据信息」
    },
    ...
  })
*/

/* $.ajax({
  url: '/api/info',
  success(result) {
    // 第一个请求成功
    // ...
    $.ajax({
      url: '/api/ranking?id=' + result.id,
      success(result2) {
        // 第二个请求成功
        // ...
        $.ajax({
          url: '/api/prize?rank=' + result2.rank,
          success(result3) {
            // 第三个请求成功
            // ...
          }
        })
      }
    })
  }
}) */

//=================================================================
/* 基于 Promise 管理异步操作 */
/* const delay = function delay(interval = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, interval)
  })
} */

/* 
// 并行：无需自己写计数器监测是否都成功，基于 Promise.all 就解决了
let p1 = delay(3000).then(() => {
  console.log('A')
})
let p2 = delay().then(() => {
  console.log('B')
})
let p3 = delay(2000).then(() => {
  console.log('C')
})
Promise.all([p1, p2, p3]).then(() => {
  console.log('并行操作都处理完毕了')
}) 
*/

/* 
// 串行：有效避免回调地狱
/!* delay(3000)
  .then(() => {
    console.log('A')
    return delay()
  })
  .then(() => {
    console.log('B')
    return delay(2000)
  })
  .then(() => {
    console.log('C')
  }) *!/
;(async function(){
  await delay(3000)
  console.log('A')

  await delay()
  console.log('B')

  await delay(2000)
  console.log('C')
})() 
*/


//=============================
/*
需求：在项目中，有三个接口请求(串行请求)，现在需要我们分别调用三个接口，完成数据的获取和绑定
  接口1：/api/info  ->  {id:xxx,....}
  接口2：/api/ranking?id=xxx  -> {rank:27}
  接口3：/api/prize?rank=27

平时项目中，我们可以使用 axios 插件来发送数据请求，相比较于 $.ajax，其不是基于 callback 回调函数的方式管理异步请求的，而是基于 Promise 来管理异步操作的！！
*/

/* axios.get('/api/info')
  .then(result => {
    // 第一个请求成功 ...
    return axios.get(`/api/ranking?id=${result.id}`)
  })
  .then(result2 => {
    // 第二个请求成功 ...
    return axios.get(`/api/prize?rank=${result2.rank}`)
  })
  .then(result3 => {
    // 第三个请求成功 ...
  }) */

/* (async () => {
  let result = await axios.get('/api/info')
  // 第一个请求成功 ...

  result = await axios.get(`/api/ranking?id=${result.id}`)
  // 第二个请求成功 ...

  result = await axios.get(`/api/prize?rank=${result.rank}`)
  // 第三个请求成功 ...
})() */

/* axios.get('/api/list').then(() => {
  // ...
})
axios.get('/api/info').then(() => {
  // ...
})
axios.get('/api/test').then(() => {
  // ...
}) */