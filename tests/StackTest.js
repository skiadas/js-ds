Stack = require('../Stack.js');
var A = new Stack();

A.push("hi").push("there").push("you")
console.log(A.list.size)
A.each(console.log);
A.each(console.log, true);
console.log(A.list.size);

var now = new Date();
N = 1e7;
for (var i=0; i < N; i++) { A.push("hi there!"); }
console.log(N + " pushes in " + (new Date() - now) + "ms.");
now = new Date();
for (var i=0; i < N; i++) { A.pop(); }
console.log(N + " pops in " + (new Date() - now) + "ms.");
