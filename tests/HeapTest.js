var chai = require('chai'),
    expect = chai.expect,
    Heap = require('../Heap.js');
chai.Assertion.includeStack = true;

describe("Heaps", function() {
    var h;
    beforeEach(function(){
        h = new Heap("v");
    });
    describe("have supported operations: insert, extract, min", function() {
        it("insert", function() {
            var obj = { v: Math.random() };
            expect(function() { h.insert(obj); }).to.not.throw;
            h.insert(obj);
            expect(h.size()).to.equal(1);
            expect(h.min()).to.equal(obj);
            expect(h.size()).to.equal(1);
            expect(h.extract()).to.equal(obj);
            expect(h.size()).to.equal(0);
        });
        it("have secondary operations: isEmpty, isHeap, size", function() {
            var N = 1000, i;
            for (i = 0; i < N; i++) {
                expect(h.isHeap()).to.be.ok;
                expect(h.isEmpty()).to.be.equal(i === 0);
                expect(h.size()).to.equal(i);
                h.insert({v: Math.random() });
            }
        });
        it("have a deleteObj operation if initialized that way", function() {
            var A = [], N = 1000, i;
            for (i = 0; i < N; i++) { A.push({v: Math.random() }) };
            h.insert(A[0]);
            expect(function() { h.deleteObj(A[0]); }).to.throw;
            h = new Heap("v", true);
            for (i = 0; i < N; i++) { h.insert(A[i]); }
            for (i = 0; i < N; i++) {
                expect(h.size()).to.equal(N-i);
                expect(h.isHeap()).to.be.ok;
                expect(function() { h.deleteObj(A[i]); }).to.not.throw;
                h.deleteObj(A[i]);
            }
        });
    });
    it("isHeap works correctly", function() {
        var i, N = 100, K = N * 2, A = [], M = 10000;
        for (i = 0; i < N; i++) {
            A[i] = { v: i };
            h.insert(A[i]);
        }
        expect(h.isHeap()).to.be.ok;
        while (M--) {
            i = Math.floor(Math.random() * (N-1) + 1);
            // console.log(M, i);
            A[i].v = A[i].v - K;
            expect(h.isHeap()).to.not.be.ok;
            A[i].v = A[i].v + K;
            expect(h.isHeap()).to.be.ok;
        }
    });
    it("min is always the smallest element", function() {
        var i, N = 100, K = N * 2, obj;
        for (i = 0; i < N; i++) { h.insert({ v: i }); }
        for (i = 0; i < N; i++) {
            expect(h.min().v).to.equal(i);
            obj = h.extract();
            expect(obj.v).to.equal(i);
        }
    });
    it("delete works correctly for removing the last item", function() {
        var i, N = 100, K = N * 2, obj;
        for (i = 0; i < N; i++) { h.insert({ v: i }); }
        for (i = N; i-- > 1;) {
            expect(function() { h.delete(i + 1); }).to.throw;
            expect(function() { h.delete(i); }).to.not.throw;
            h.delete(i);
            expect(h.isHeap()).to.be.ok;
            expect(h.size()).to.equal(i);
        }
    });
    describe("can work without an isLess comparator/key for simple objects (numbers)", function() {
        beforeEach(function(){ h = new Heap(); });
        it("can insert, extract, min", function() {
            var A = [], i, N = 100;
            for (i = 0; i < N; i++) {
                A[i] = Math.random(); h.insert(A[i]);
            }
            A = A.sort();
            for (i = 0; i < N; i++) {
                expect(h.min()).to.equal(A[i]);
                expect(h.extract()).to.equal(A[i]);
            }
        });
    });
});
