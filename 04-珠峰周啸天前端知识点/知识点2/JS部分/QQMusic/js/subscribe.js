/* 发布订阅设计模式 */
(function () {
    // 构建事件池
    let listeners = {};

    // 向事件池中注入方法
    const on = function on(event, callback) {
        if (!listeners[event]) listeners[event] = [];
        let arr = listeners[event];
        if (!arr.includes(callback)) {
            arr.push(callback);
        }
    };

    // 从事件池中移除方法
    const off = function off(event, callback) {
        let arr = listeners[event];
        if (!arr) return;
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (item === callback) {
                arr[i] = null;
                break;
            }
        }
    };

    // 通知事件池中的方法执行 
    const emit = function emit(event, ...params) {
        let arr = listeners[event];
        if (!arr) return;
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (typeof item === "function") {
                item(...params);
                continue;
            }
            arr.splice(i, 1);
            i--;
        }
    };

    // 暴露API
    window.$sub = {
        on,
        off,
        emit
    };
})();