var chai = require('chai'),
    expect = chai.expect,
    Sort = require('../Sort.js');
chai.Assertion.includeStack = true;

describe("InsertionSort", function() {
    it("should correctly sort array", function() {
        var N = 1000,
            A = new Array(N),
            reps = 50;
        while (reps--) {
            for (var i = 0; i < N; i++) A[i] = Math.floor(Math.random() * 20);
            Sort.insertionSort(A);
            expect(Sort.isSorted(A)).to.be.true;
        }
    });
});
describe("ShellSort", function() {
    it("should correctly sort array", function() {
        var N = 1000,
            A = new Array(N),
            reps = 50;
        while (reps--) {
            for (var i = 0; i < N; i++) A[i] = Math.floor(Math.random() * 20);
            Sort.shellSort(A);
            expect(Sort.isSorted(A)).to.be.true;
        }
    });
});
describe("MergeSort", function() {
    it("should correctly sort array", function() {
        var N = 1000,
            A = new Array(N),
            reps = 50;
        while (reps--) {
            for (var i = 0; i < N; i++) A[i] = Math.floor(Math.random() * 20);
            Sort.mergeSort(A);
            expect(Sort.isSorted(A)).to.be.true;
        }
    });
});
describe("QuickSort", function() {
    it("should correctly sort array", function() {
        var N = 1000,
            A = new Array(N),
            reps = 50;
        while (reps--) {
            for (var i = 0; i < N; i++) A[i] = Math.floor(Math.random() * 20);
            Sort.quickSort(A);
            expect(Sort.isSorted(A)).to.be.true;
        }
    });
});
describe("QuickSort3way", function() {
    it("should correctly sort array", function() {
        var N = 1000,
            A = new Array(N),
            reps = 50;
        while (reps--) {
            for (var i = 0; i < N; i++) A[i] = Math.floor(Math.random() * 20);
            Sort.quickSort3way(A);
            expect(Sort.isSorted(A)).to.be.true;
        }
    });
});
describe("Shuffle", function() {
    it("should attain close to uniform frequency at each point", function() {
        var N = 10,
            A = new Array(N),
            reps = 10000,
            freqs = new Array(N),
            i, j;
        for (i = 0; i < N; i++) {
            freqs[i] = new Array(N);
            for (j = 0; j < N; j++) { freqs[i][j] = 0; }
        }
        while (reps--) {
            for (i = 0; i < N; i++) { A[i] = i; }
            Sort.shuffle(A);
            for (i = 0; i < N; i++) { freqs[i][A[i]]++; }
        }
        for (i = 0; i < N; i++) {
            for (j = 0; j < N; j++) {
                expect(freqs[i][j]/(reps/N) < 10/reps).to.be.true;
            }
        }
    });
});
// 
// var t = new Tree();
// t.add({a: 'yo!'}).add({a: 'there'}).add({a: 'you!'}).add({a: 'now!'});
// console.log(t.root);
