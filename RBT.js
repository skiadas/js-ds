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
        utils = require('./utils/object.js'),
        Null = {},
        BLACK = 1,
        RED = 0;
    
    //Inherit all properties from BST Null
    utils.extend(Null, BST.Node.Null, {
        left: Null,
        right: Null,
        isRed: function() { return false; },
        isBlack: function() { return true; },
        balance: function() { return this; },
        put: function(key, value) { return new Node(key ,value); },
        isRBT: function() { return 1; } // Returns "black count"
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

    Node.Null = Null;
    Node.prototype = new BST.Node();
    utils.extend(Node.prototype, {
        isRed: function() { return this.color === RED; },
        isBlack: function() { return !this.isRed(); },
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
            this.left.color = this.right.color = (this.color === RED ? RED : BLACK);
            this.color = (this.color === RED ? BLACK : RED);
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
            if (that.right.isRed() && that.left.isBlack()) { that = that.rotateLeft(); }
            if (that.left.isRed() && that.left.left.isRed()) { that = that.rotateRight(); }
            if (that.left.isRed() && that.right.isRed()) that.flipColors();
            return that;
        },
        balance: function() {
            return (this.right.isRed() ? this.rotateLeft() : this);
        },
        moveRedLeft: function() {
            this.flipColors();
            var that = this;
            if (that.right.left.isRed()) {
                that.right = that.right.rotateRight();
                that = that.rotateLeft();
            }
            return that;
        },
        moveRedRight: function() {
            // var that = this;
            this.flipColors();
            var that = this;
            return (that.left.left.isRed() ? that : that.rotateRight());
        },
        deleteMin: function() {
            if (this.left.isNull()) return this.right;
            var that = this;
            if (that.left.isBlack() && that.left.left.isBlack()) {
                that = that.moveRedLeft();
            }
            that.left = that.left.deleteMin();
            return that.fixSize().balance();
        },
        deleteMax: function() {
            var that = this;
            if (that.left.isRed()) that = that.rotateRight();
            if (that.right.isNull()) return that.left;
            if (that.right.isBlack() && that.right.left.isBlack()) that = that.moveRedRight();
            that.right = that.right.deleteMax();
            return that.fixSize().balance();
        },
        delete: function(key, compare) {
            var that = this,
                comp = compare(key, this.key);
            if (comp < 0) {
                if (that.left.isBlack() && that.left.left.isBlack()) {
                    that = that.moveRedLeft();
                }
                that.left = that.left.delete(key, compare);
                return that.fixSize().balance();
            }
            if (that.left.isRed()) that = that.rotateRight();
            if (compare(key, that.key) > 0) {
                that.right = that.right.delete(key, compare);
                return that.fixSize().balance();
            } 
            // Found the key
            if (that.right.isNull()) return that.left.fixSize().balance();
            var x = that.right.min();
            that.key = x.key;
            that.value = x.value;
            that.right = that.right.deleteMin();
            return that.fixSize().balance();
        },
        isRBT: function() {
            // Returns "null" if it is not RBT, or the "black count" otherwise
            if (this.right.isRed()) return false;
            if (this.isRed() && this.left.isRed()) return false;
            var bcl = this.left.isRBT(),
                bcr = this.right.isRBT();
            if (bcl === null || bcr === null || bcl !== bcr) return false;
            return bcl + (this.isRed() ? 0 : 1);
        }
    });
    
    function RBT(compare) {
        BST.call(this, compare);
        this.root = Null;
    }

    RBT.Node = Node;
    RBT.prototype = new BST();
    utils.extend(RBT.prototype, {
        put: function(key, value) {
            this.root = this.root.put(key, value, this.compare);
            this.root.color = BLACK;
            return this;
        },
        isRBT: function() {
            return (this.root.isBlack() && this.root.isRBT() !== null);
        },
        deleteMin: function() {
            if (this.root.left.isBlack() && this.root.right.isBlack()) this.root.color = RED;
            this.root = this.root.deleteMin();
            this.root.color = BLACK;
            return this;
        },
        deleteMax: function() {
            if (this.root.left.isBlack() && this.root.right.isBlack()) this.root.color = RED;
            this.root = this.root.deleteMax();
            this.root.color = BLACK;
            return this;
        },
        delete: function(key) {
            if (!this.has(key)) return this;
            if (this.root.left.isBlack() && this.root.right.isBlack()) this.root.color = RED;
            this.root = this.root.delete(key, this.compare);
            this.root.color = BLACK;
            return this;
        }
    });
    
    return RBT;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
