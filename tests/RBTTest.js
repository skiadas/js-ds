var chai = require('chai'),
    expect = chai.expect,
    RBT = require('../RBT.js');
chai.Assertion.includeStack = true;

describe("Red Black Trees", function() {
    var t;
    beforeEach(function(){
        t = new RBT();
    });
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
        expect(t.isRBT()).to.be.true;
    });
    it("increase size with each new element and maintain the red-black properties", function() {
       var N = 100;
       for (var i = 1; i < N; i++) {
           t.put(Math.random(), "foo");
           expect(t.size()).to.equal(i);
           expect(t.isBST()).to.be.true;
           expect(t.isRBT()).to.be.true;
       }
    });
    it("assign a color to each node", function() {
        t.put(23);
        expect(t.root.key).to.equal(23);
        expect(t.root.isRed()).to.be.false;
        expect(t.root.isRBT()).to.equal(2);
        t.put(34);
        expect(t.root.key).to.equal(34);
        expect(t.root.isRed()).to.be.false;
        expect(t.root.left.key).to.equal(23);
        expect(t.root.left.isRed()).to.be.true;
        expect(t.root.isRBT()).to.equal(2);
        t.put(45);
        expect(t.root.key).to.equal(34);
        expect(t.root.right.key).to.equal(45);
        expect(t.root.isRed()).to.be.false;
        expect(t.root.left.isRed()).to.be.false;
        expect(t.root.right.isRed()).to.be.false;
        expect(t.isRBT()).to.be.true;
        expect(t.root.isRBT()).to.equal(3);
    });
    it("have a deleteMin method", function() {
        var N = 100, A = [];
        for (var i = 0; i< N; i++) {
            A.push(Math.random());
            t.put(A[i]);
        }
        A.sort();
        for (var i = 0; i< N; i++) {
            expect(t.min()).to.equal(A[i]);
            expect(t.isBST()).to.be.true;
            expect(t.isRBT()).to.be.true;
            expect(t.size()).to.equal(N-i);
            t.deleteMin();
        }
    });
    it("have a deleteMax method", function() {
        var N = 100, A = [];
        for (var i = 0; i < N; i++) {
            A.push(Math.random());
            t.put(A[i]);
        }
        A.sort().reverse();
        for (var i = 0; i < N; i++) {
            expect(t.max()).to.equal(A[i]);
            expect(t.isRBT()).to.be.ok;
            expect(t.size()).to.equal(N-i);
            t.deleteMax();
        }
    });
    it("have a delete method", function() {
        var N = 100, A = [];
        for (var i = 0; i< N; i++) {
            A.push(Math.random());
            t.put(A[i], "");
        }
        expect(t.size()).to.equal(A.length);
        for (var i = N; i--;) {
            var j = Math.floor(Math.random() * i),
                temp = A[j];
            A[j] = A[i];
            A.pop();
            expect(t.has(temp)).to.be.ok;
            t.delete(temp);
            expect(t.has(temp)).not.to.be.ok;
            expect(t.isRBT()).to.be.ok;
            expect(t.size()).to.equal(A.length);
        }
    });
});
