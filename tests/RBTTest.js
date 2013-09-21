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
    });
    it("increase size with each new element", function() {
       var N = 100;
       for (var i = 1; i < N; i++) {
           t.put(Math.random(), "foo");
           expect(t.size()).to.equal(i);
           expect(t.isBST()).to.be.true;
       }
    });
    it("assign a color to each node", function() {
        t.put(23);
        expect(t.root.isRed()).to.equal.false;
    });
});
