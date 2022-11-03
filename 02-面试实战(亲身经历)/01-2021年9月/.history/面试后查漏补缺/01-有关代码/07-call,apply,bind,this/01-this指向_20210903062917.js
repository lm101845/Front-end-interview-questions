/*
 * @Author: liming
 * @Date: 2021-09-03 06:28:13
 * @LastEditTime: 2021-09-03 06:29:17
 * @FilePath: \01-2021年9月\面试后查漏补缺\01-有关代码\07-call,apply,bind,this\01-this指向.js
 */

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        
    </script>
</body>
</html>
var name = "windowsName";
function a() {
  var name = "Cherry";

  console.log(this.name); // windowsName

  console.log("inner:" + this); // inner: Window
}
a();
console.log("outer:" + this); // outer: Window
