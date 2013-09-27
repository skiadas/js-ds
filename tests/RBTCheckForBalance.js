var RBT = require('../RBT.js');
var t = new RBT();
var N = 1e4;
var now = new Date();
for (var i = 0; i < N; i++) {
    t.put(Math.random(), "");
}
console.log("Inserted", t.size(), "numbers in", new Date() - now, "ms");
console.log("Depth:", t.depth(), t.size(), t.keys().length);

now = new Date();
for (var i = 0; i < N; i++) {
    var x = t.select(Math.floor(Math.round() * N) + 1);
    if (t.has(x)) {
        t.delete(x);
        t.put(Math.random(), "");
    } else {
        console.log(x, t.has(x));
    }
}
console.log("Deleted and inserted", N, "numbers in", new Date() - now, "ms");
console.log("Depth:", t.depth(), t.size(), t.keys().length);