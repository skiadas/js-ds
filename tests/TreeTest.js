var chai = require('chai'),
    expect = chai.expect,
    Tree = require('../Tree.js');
chai.Assertion.includeStack = true;

describe("Tree", function() {
    it("should start empty", function() {
        var t = new Tree();
        expect(t.size()).to.equal(0);
    });
    it("should insert elements on 'add'", function() {
        var t = new Tree();
        expect(function() { t.add({a: 1}); }).to.not.throw(Error);
        expect(t.root).to.not.equal(null);
        expect(t.root.item.a).to.equal(1);
        expect(t.root.size).to.equal(1);
        expect(t.size()).to.equal(1);
    });
    it("increases size with each new element", function() {
        var t = new Tree();
        for (var i=1; i < 10; i++) {
            expect(function() { t.add({a: i}); }).to.not.throw(Error);
            expect(t.size()).to.equal(i);
        }
        expect(t.root.left).to.not.equal(null);
        expect(t.root.right).to.not.equal(null);
        expect(t.root.left.parent).to.equal(t.root);
        expect(t.root.right.parent).to.equal(t.root);
        expect(t.root.left.left.parent).to.equal(t.root.left);
        expect(t.root.left.right.parent).to.equal(t.root.left);
        expect(t.root.right.left.parent).to.equal(t.root.right);
        expect(t.root.right.right.parent).to.equal(t.root.right);
    });
    it("tries to maintain balance on inserts", function() {
        var t = new Tree();
        for (var i=1; i < 30; i++) {
            expect(function() { t.add({a: i}); }).to.not.throw(Error);
            expect(t.size()).to.equal(i);
        }
        expect(t.root.item.a).to.equal(1);
        expect(t.root.left.item.a).to.equal(2);
        expect(t.root.right.item.a).to.equal(3);
        expect(t.root.left.left.item.a).to.equal(4);
        expect(t.root.right.left.item.a).to.equal(5);
        expect(t.root.left.right.item.a).to.equal(6);
    });
    describe("nodes", function() {
        var t = new Tree();
        for (var i=1; i < 10; i++) { t.add({a: i}); }
        it("know if they are root", function() {
            expect(t.root.isRoot()).to.be.true;
            expect(t.root.left.isRoot()).to.be.false;
            expect(t.root.right.isRoot()).to.be.false;
        });
        it("can determine which side of their parent they are on", function() {
            expect(t.root.left.parentSide()).to.equal('left');
            expect(t.root.right.parentSide()).to.equal('right');
            expect(t.root.left.left.parentSide()).to.equal('left');
            expect(t.root.left.right.parentSide()).to.equal('right');
            expect(t.root.right.left.parentSide()).to.equal('left');
            expect(t.root.right.right.parentSide()).to.equal('right');
        });
    });
});
// 
// var t = new Tree();
// t.add({a: 'yo!'}).add({a: 'there'}).add({a: 'you!'}).add({a: 'now!'});
// console.log(t.root);
