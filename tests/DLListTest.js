var chai = require('chai'),
    expect = chai.expect,
    DLList = require('../DLList.js');
chai.Assertion.includeStack = true;

describe("Double Linked Lists", function() {
    var t;
    beforeEach(function(){
        t = new DLList();
    });
    it("have an 'iterator'", function() {
        t.addFirst(3).addFirst(2).addFirst(1);
        var it = t.iterator();
        expect(it.done()).to.not.be.ok;
        expect(it.next()).to.equal(1);
        expect(it.done()).to.not.be.ok;
        expect(it.next()).to.equal(2);
        expect(it.done()).to.not.be.ok;
        expect(it.next()).to.equal(3);
        expect(it.done()).to.be.ok;
        expect(it.next()).to.equal(null);
        expect(it.done()).to.be.ok;
        var it = t.iterator(true);
        expect(it.next()).to.equal(3);
        expect(it.next()).to.equal(2);
        expect(it.next()).to.equal(1);
        expect(it.next()).to.equal(null);
    });
});