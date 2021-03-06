var chai = require('chai'),
    expect = chai.expect,
    Iterable = require('../utils/Iterable.js'),
    object = require('../utils/object.js');
chai.Assertion.includeStack = true;

// mixin(Array.prototype);

describe("The Iterable mixin", function() {
    var A;
    beforeEach(function() {
        A = new Iterable([1, 4, 6]);
    });
    it("provides a map method", function() {
        expect(A.map(function(x) { return x*x; }).toArray()).to.deep.equal([1,16,36]);
    });
    it("provides a foldl method", function() {
        expect(A.foldl(function(x, y) { return x+y; })).to.equal(11);
        var B = A.foldl(function(x, y) { return [x, y]; });
        expect(B.length).to.equal(2);
        expect(B[0]).to.deep.equal([1, 4]);
        expect(B[1]).to.equal(6);
        A = new Iterable([1]);
        expect(A.foldl(function(x, y) { return x+y; })).to.equal(1);
        expect(A.foldl(function(x, y) { return [x, y]; })).to.equal(1);
    });
    it("provides a foldr method", function() {
        expect(A.foldr(function(x, y) { return x+y; })).to.equal(11);
        var B = A.foldr(function(x, y) { return [x, y]; });
        expect(B.length).to.equal(2);
        expect(B[0]).to.equal(1);
        expect(B[1]).to.deep.equal([4, 6]);
        B = new Iterable([1]);
        expect(B.foldr(function(x, y) { return x+y; })).to.equal(1);
        expect(B.foldr(function(x, y) { return [x, y]; })).to.equal(1);
    });
    it("provides a skip method", function() {
        expect(A.skip(1).toArray()).to.deep.equal([4,6]);
        expect(A.skip(2).toArray()).to.deep.equal([6]);
    });
    it("provides a take method", function() {
        expect(A.take(1).toArray()).to.deep.equal([1]);
        expect(A.take(2).toArray()).to.deep.equal([1,4]);
    });
    it("has 'seq' and 'repeat' constructors", function() {
        expect(Iterable.seq(1,2).take(3).toArray()).to.deep.equal([1,3,5]);
        expect(Iterable.repeat(2).take(3).toArray()).to.deep.equal([2,2,2]);
    });
    it("has an 'accumulate' method", function() {
        A = Iterable.seq(1, 2).accumulate(function(acc, next) { return acc + next; });
        expect(A.take(5).toArray()).to.deep.equal([1,4,9,16,25]);
        A = Iterable.seq(1, 2).accumulate("+");
        expect(A.take(5).toArray()).to.deep.equal([1,4,9,16,25]);
    });
});
