var BST = require('../BST.js');
var t = new BST();
var N = 1e5;
var now = new Date();
for (var i = 0; i < N; i++) {
    t.put(Math.random());
}
console.log("Inserted", t.size(), "numbers in", new Date() - now, "ms");
console.log("Depth:", t.depth());

now = new Date();
for (var i = 0; i < N; i++) {
    t.delete(Math.floor(Math.round() * N) + 1);
    t.put(Math.random());
}
console.log("Deleted and inserted", N, "numbers in", new Date() - now, "ms");
console.log("Depth:", t.depth());