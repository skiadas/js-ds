var chai = require('chai'),
    expect = chai.expect,
    Stack = require('../Stack.js');
chai.Assertion.includeStack = true;

describe("Stacks", function() {
    var t;
    beforeEach(function(){
        t = new Stack();
    });
    it("have an 'iterator'", function() {
        t.push(3).push(2).push(1);
        var it = t.iterator();
        expect(it.next()).to.equal(1);
        expect(it.next()).to.equal(2);
        expect(it.next()).to.equal(3);
        expect(it.next()).to.equal(null);
        expect(it.next()).to.equal(null);
    });
});