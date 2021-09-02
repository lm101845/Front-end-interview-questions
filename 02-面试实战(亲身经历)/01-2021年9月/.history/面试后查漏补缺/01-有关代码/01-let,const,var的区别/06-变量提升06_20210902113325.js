function person(status) {
  if (status) {
    var value = "蛙人";
  } else {
    console.log(value); // undefined
  }
  console.log(value); // undefined
}
person(false);
