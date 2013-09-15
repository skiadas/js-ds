UF = require('../UnionFind.js');
var A = new UF(8);

// You can then read the components by calling A.components();
// Or call A.components(i) to get the component containing i;
A.union(1, 2).union(3, 4).union(0, 4).union(2, 4).union(7, 3);
console.log(A);
