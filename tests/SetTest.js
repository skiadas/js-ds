var chai = require('chai'),
    expect = chai.expect,
    Set = require('../Set.js'),
    range = require('../utils/range.js');

chai.Assertion.includeStack = true;

describe("In Set objects", function() {
    var s, t1, t2;
    beforeEach(function() {
        s = new Set();
        t1 = Math.random(), t2 = Math.random();
    })
    it("can 'add' elements", function() {
        expect(function() {s.add(23)}).to.not.throw;
        expect(function() {s.add(46)}).to.not.throw;
    });
    it("can check if set 'contains' an element", function() {
        s.add(t1).add(t1+t2);
        expect(s.contains(t1)).to.be.ok;
        expect(s.contains(t1+t2)).to.be.ok;
        expect(s.contains(t1+t2+1)).to.not.be.ok;
    });
    it("can 'delete' elements", function() {
        s.add(t1).add(t1+t2);
        expect(s.delete(t1+t2)).to.equal(t1+t2);
        expect(s.contains(t1+t2)).to.not.be.ok;
        expect(s.contains(t1)).to.be.ok;
    });
    it("can retrieve an array of the 'elements'", function() {
        s.add(t1).add(t1+t2);
        var A = s.elements();
        expect(A.length).to.equal(2);
        expect(A).to.contain(t1);
        expect(A).to.contain(t1+t2);
    });
    it("can form 'intersection' of two sets", function() {
        s.add(t1).add(t1+t2);
        var s2 = new Set();
        s2.add(t1).add(t1+2*t2);
        var s3 = s.intersection(s2);
        expect(s3.elements().sort()).to.deep.equal([t1]);
    });
    it("can form 'union' of two sets", function() {
        s.add(t1).add(t1+t2);
        var s2 = new Set();
        s2.add(t1).add(t1+2*t2);
        var s3 = s.union(s2);
        expect(s3.elements().sort()).to.deep.equal([t1, t1+t2, t1+2*t2]);
    });
    it("union and intersection can accept a variable list of arguments", function() {
        s.add(t1).add(t1+t2);
        var s2 = new Set(), s3 = new Set();
        s2.add(t1).add(t1+2*t2);
        s3.add(t1).add(t1+3*t2);
        var s4 = s.union(s2, s3);
        expect(s4.elements().sort()).to.deep.equal([t1, t1+t2, t1+2*t2, t1+3*t2]);
        var s5 = s.intersection(s2, s3);
        expect(s5.elements().sort()).to.deep.equal([t1]);
    });
    it("we have a toString method", function() {
        s.add(2).add(1);
        expect(s.toString()).to.equal("{1, 2}");
    });
});
