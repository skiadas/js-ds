// Implementation of a red-black binary search trees
// 
// Expect a "comparator" function `compare` to compare keys:
// compare(a, b) should return < 0 if a < b, > 0 if a > b, = 0 if a==b.
// Instead of a function, you can also provide a key name.
// If omitted, we assume keys react to "<"
//
(function(define){ 'use strict';
define(function(require) {

    var BST = require('./BST.js'),
        utils = require('./utils.js'),
        Null = {},
        BLACK = 1,
        RED = 0;
    
    //Inherit all properties from BST Null
    utils.extend(Null, BST.Node.Null, {
        isRed: function() { return false; },
        put: function(key, value) { return new Node(key ,value); }
    });
    // Use that instead of an explicit color setting to ensure it does not change
    // Ensure we're using the RBT Node version
    
    function Node(key, value) {
        BST.Node.call(this, key, value);
        utils.extend(this, {
            left: Null,  // Use the RBT Null object instead
            right: Null,
            color: RED
        })
    }
    
    Node.prototype = new BST.Node();
    utils.extend(Node.prototype, {
        isRed: function() { return this.color === RED; },
        _rotateLeft: BST.Node.prototype.rotateLeft,
        rotateLeft: function() {
            var that = this._rotateLeft();
            var cl = that.left.color;
            that.left.color = that.color;
            that.color = cl;
            return that;
        },
        _rotateRight: BST.Node.prototype.rotateRight,
        rotateRight: function() {
            var that = this._rotateRight();
            var cl = that.right.color;
            that.right.color = that.color;
            that.color = cl;
            return that;
        },
        flipColors: function() {
            if ((this.left.isRed()) && (this.right.isRed())) {
                this.left.color = this.right.color = BLACK;
                this.color = RED;
            }
            return this;
        },
        put: function(key, value, compare) {
            var comp = compare(key, this.key),
                that = this;
            if (comp === 0) { that.value = value; } else {
                var side = (comp < 0) ? 'left' : 'right';
                that[side] =  that[side].put(key, value, compare);
            }
            that.fixSize();
            if (that.right.isRed() && !that.left.isRed()) { that = that.rotateLeft(); }
            if (that.left.isRed() && that.left.left.isRed()) { that = that.rotateRight(); }
            return that.flipColors();
        }
    });
    
    function RBT(compare) {
        BST.call(this, compare);
        this.root = Null;
    }

    RBT.prototype = new BST();
    utils.extend(RBT.prototype, {
        put: function(key, value) {
            this.root = this.root.put(key, value, this.compare);
            this.root.color = BLACK;
            return this;
        }
    });
    
    return RBT;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
