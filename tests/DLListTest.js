DLL = require('../DLList.js');
var A = new DLL();

A.addFirst("hi").addFirst("there").addFirst("you")
console.log(A)
A.each(console.log);
