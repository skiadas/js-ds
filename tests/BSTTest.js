var chai = require('chai'),
    expect = chai.expect,
    BST = require('../BST.js');
chai.Assertion.includeStack = true;

describe("Binary Search Trees", function() {
    var t;
    beforeEach(function(){
        t = new BST();
    })
    it("should start empty", function() {
        expect(t.size()).to.equal(0);
        expect(t.depth()).to.equal(0);
    });
    it("should insert elements on 'put' and return them with 'get'", function() {
        var key = Math.random(),
            val = Math.random();
        t.put(key, val);
        expect(t.get(key)).to.equal(val);
        expect(t.get(key + 1) == null).to.be.true;
        expect(t.isBST()).to.be.true;
    });
    it("increase size with each new element", function() {
       var N = 100;
        for (var i = 1; i < N; i++) {
            t.put(Math.random(), "foo");
            expect(t.size()).to.equal(i);
            expect(t.isBST()).to.be.true;
        }
    });
    describe("deletion", function() {
        it("should result in null root on deleting all elements", function() {
            t.put(23, "foo").delete(23);
            expect(t.size()).to.equal(0);
        });
        it("should handle nodes with no kids", function() {
            t.put(23, "foo").put(13, "foo").put(30, "foo");
            t.delete(13);
            expect(t.size()).to.equal(2);
            t.delete(30);
            expect(t.size()).to.equal(1);
            t.delete(23);
            expect(t.size()).to.equal(0);
        });
        it("should handle nodes with one kid", function() {
            t.put(23, "foo").put(13, "foo").put(5, "foo");
            t.delete(13);
            expect(t.size()).to.equal(2);
            expect(t.root.key).to.equal(23);
            expect(t.root.left.key).to.equal(5);
            t.put(30).put(35).delete(30);
            expect(t.size()).to.equal(3);
            expect(t.root.key).to.equal(23);
            expect(t.root.right.key).to.equal(35);
        });
        it("should handle nodes with two kids", function() {
            t.put(23).put(13).put(5).put(18);
            t.delete(13);
            expect(t.size()).to.equal(3);
            expect(t.root.left).not.to.equal(null);
            t.delete(23).delete(5).delete(18);
            expect(t.size()).to.equal(0);
        });
        it("even when those kids have kids", function() {
            t.put(23).put(13).put(5).put(18)
            .put(3).put(6);
            t.delete(13);
            expect(t.size()).to.equal(5);
        });
        
        it("and a more massive delete effort", function() {
            t.put(23, "foo");
            t.delete(23);
            expect(t.size()).to.equal(0);
            var N = 50,
                A = [], key;
            for (var i = 1; i <= N; i++) {
                key = Math.random();
                t.put(key, "foo");
            }
            for (i = N; i--;) {
                expect(t.size()).to.equal(i + 1);
                t.delete(A[i - 1]);
            }
        });
        // Uncomment this test to check for memory leaks on deletes
        it.skip("should not leak memory on deletes", function() {
            var i = 0, limit = 1e10;
            var N = 50,
                A = [], key;
            while (i++ < 1e10) {
                for (var i = 1; i <= N; i++) {
                    key = Math.random();
                    t.put(key, "foo");
                }
                for (i = N; i--;) {
                    expect(t.size()).to.equal(i + 1);
                    t.delete(A[i - 1]);
                }
                global.gc(); // Need to run it with node --expose-gc
            }
        });
    });
    describe("support in order traversal", function() {
        it("with 'keys'", function() {
            var N = 1000;
            for (var i = 1; i < N; i++) { t.put(Math.random(), "foo"); }
            var keys = t.keys();
            expect(keys.length).to.equal(t.size());
            for (i = 1; i < keys.length; i++) {
                expect(keys[i]).to.be.above(keys[i-1]);
            }
        });
        it("which also accepts bounds", function() {
            var N = 1000;
            for (var i = 1; i < N; i++) { t.put(Math.random(), "foo"); }
            var keys = t.keys(0.4, 0.45);
            expect(keys.length).to.above(0);
            expect(keys[0]).to.be.at.least(0.4);
            expect(keys[keys.length - 1]).to.be.at.most(0.45);
            for (i = 1; i < keys.length; i++) {
                expect(keys[i]).to.be.above(keys[i-1]);
            }
        });
        it("and works on empty trees", function() {
            expect(t.keys().length).to.equal(0);
        });
        it("or using 'forEach' with a callback", function() {
            var N = 1000, prev = -Infinity, i, counter = 0;
            function callback(value, key) {
                counter++;
                expect(value).to.equal("foo");
                expect(key).to.be.above(prev);
                prev = key;
            }
            for (var i = 1; i < N; i++) { t.put(Math.random(), "foo"); }
            t.forEach(callback);
            expect(counter).to.equal(t.size());
        });
    })
    describe("support order methods", function() {
        var N = 100, A;
        beforeEach(function() {
            A = [];
            for (var i = 0; i < N; i++) {
                A.push(Math.random());
                t.put(A[i], "foo");
            }
        });
        it("min and max", function() {
            expect(t.min()).to.equal(A.reduce(function (p, v) { return( p < v ? p : v ); }));
            expect(t.max()).to.equal(A.reduce(function (p, v) { return( p > v ? p : v ); }));
        });
        it("floor and ceil", function() {
            for (var i = 0; i < N; i++) {
                expect(t.floor(A[i])).to.equal(A[i]);
                expect(t.ceil(A[i])).to.equal(A[i]);
                expect(t.floor(A[i] + 0.0000001)).to.equal(A[i]);
                expect(t.ceil(A[i] - 0.0000001)).to.equal(A[i]);
                expect(t.floor(A[i] - 0.0000001)).not.to.equal(A[i]);
                expect(t.ceil(A[i] + 0.0000001)).not.to.equal(A[i]);
            }
            A.sort();
            for (var i = 1; i < N; i++) {
                expect(t.floor(A[i] - 0.000001)).to.equal(A[i-1]);
                expect(t.ceil(A[i-1] + 0.0000001)).to.equal(A[i]);
            }
        });
        it("select and rank", function() {
            A.sort();
            for (var i = 0; i < N; i++) {
                expect(t.select(i + 1)).to.equal(A[i]);
                expect(t.rank(A[i])).to.equal(i + 1);
                expect(t.rank(A[i] + 0.0000001)).to.equal(i + 1);
                expect(t.rank(A[i] - 0.0000001)).to.equal(i);
            }
            expect(t.rank(A[0] - 1)).to.equal(0);
            expect(t.rank(A[N-1] + 1)).to.equal(t.size());
        });
    });
    it("have a 'depth' function", function() {
        expect(t.put(23).depth()).to.equal(1);
        expect(t.put(14).put(45).depth()).to.equal(2);
        expect(t.put(6).depth()).to.equal(3);
    });
});
