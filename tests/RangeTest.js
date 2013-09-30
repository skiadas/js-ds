var chai = require('chai'),
    expect = chai.expect,
    range = require('../utils/range.js');
chai.Assertion.includeStack = true;

describe("Range objects", function() {
    it("do iteration", function() {
        var N = 100, c, d, e, A;
        while(N--) {
            c = d = Math.ceil(Math.random() * 200);
            e = d + Math.ceil(Math.random() * 200);
            range(d, e).each(function(i) { expect(i).to.equal(c++); });
            expect(c).to.equal(e + 1);
            A = range(d, e).map(function(i) { return i; });
            expect(A.length).to.equal(e - d + 1);
            for (var i = 0; i <= e - d; i++) {
                expect(A[i]).to.equal(d + i);
            }
        }
    });
    it("with variable step", function() {
        var N = 100, c, d, e, step = Math.ceil(Math.random() * 10);
        while(N--) {
            c = d = Math.ceil(Math.random() * 200);
            e = d + Math.random() * 200;
            range(d, e, step).each(function(i) {
                expect(i).to.equal(c);
                c = c + step;
            });
            expect(c).to.be.above(e);
            A = range(d, e).map(function(i) { return i; });
            expect(A.length).to.equal(Math.floor(e - d + 1));
            for (var i = 0; i <= e - d; i += step) {
                expect(A[i]).to.equal(d + i);
            }
        }
    });
    it("can accept step functions", function() {
        var A = range(1, 10, function(i) { return 2 * i; }).map();
        expect(A).to.deep.equal([1,2,4,8]);
        expect(range(1, 20, range.step_mult(2)).map()).to.deep.equal([1,2,4,8,16]);
    });
    it("deal with negative steps and other variations as well", function() {
        expect(range(5, 2).map()).to.deep.equal([5,4,3,2]);
        expect(range(5, 2, -2).map()).to.deep.equal([5,3]);
        expect(range(5).map()).to.deep.equal([0,1,2,3,4,5]);
        expect(range(-5).map()).to.deep.equal([0,-1,-2,-3,-4,-5]);
    });
});
