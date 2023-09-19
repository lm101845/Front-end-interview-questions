/* let obj = {
    x: 1,
    y: [10, 20]
};
let obj2 = obj;
let obj3 = {
    ...obj2
};
obj2.x = 100;
obj2.y[1] = 30;
obj3.x = 200;
obj3.y[2] = 40;
obj = obj3.y = {
    x: 0,
    y: [1, 2]
};
console.log(obj, obj2, obj3); */


/* let x = 5;
const fn = function fn(x) {
    return function (y) {
        console.log(y + (++x));
    }
};
let f = fn(6);
f(7);
fn(8)(9);
f(10);
console.log(x); */


/* let a = 0,
    b = 0;
function A(a) {
    A = function (b) {
        alert(a + b++);
    };
    alert(a++);
}
A(1);
A(2); */


