Heap = require('../Heap.js');
var A = new Heap("v");

// You can then read the components by calling A.components();
// Or call A.components(i) to get the component containing i;

// console.log(A.isLess({v: 12}, {v: 13}))
// console.log(A.isLess({v: 13}, {v: 12}))
var now = new Date();
N = 3e5;
for (var i=0; i<N; i++) {
    var val = Math.floor(Math.random() * 30)
    // console.log("Inserting: ", val);
    A.insert({v: val});
}
console.log(N + " inserts in " + (new Date() - now) + "ms.");
console.log(A.length);
// A.insert({v: 5}).insert({v:2})
now = new Date();
var prev = A.extract();
while (!A.isEmpty()) { 
    var next = A.extract();
    if (next < prev) { throw new Error("Danger Will Robinson!"); }
    prev = next;
}
console.log(N + " extracts in " + (new Date() - now) + "ms.");


for (var i=0; i<10; i++) {
    var val = Math.floor(Math.random() * 30)
    // console.log("Inserting: ", val);
    A.insert({v: val});
}

while (!A.isEmpty()) {
    console.log(A.extract());
}