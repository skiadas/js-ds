// Implementation of a binary search tree
// 
// Expect a "comparator" function `compare` to compare keys:
// compare(a, b) should return < 0 if a < b, > 0 if a > b, = 0 if a==b.
// Instead of a function, you can also provide a key name.
// If omitted, we assume keys react to "<"
//
(function(define){ 'use strict';
define(function(require) {
    
    function noop() { }

    function basic_compare(a, b) {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
    }

    function Node(key, value) {
        this.key = key;
        this.value = value;
        this.left = Null;
        this.right = Null;
        this.size = 1;
    }
    
    Node.prototype = {
        isNull: function() { return false; },
        fixSize: function() {
            this.size = this.left.size + this.right.size + 1;
            return this;
        },
        get: function(key, compare) {
            var comp = compare(key, this.key);
            if (comp === 0) return this.value;
            return this[(comp < 0) ? 'left' : 'right'].get(key, compare);
        },
        put: function(key, value, compare) {
            var comp = compare(key, this.key);
            if (comp === 0) { this.value = value; } else {
                var side = (comp < 0) ? 'left' : 'right';
                this[side] =  this[side].put(key, value, compare);
            }
            return this.fixSize();
        },
        _removeLast: function(nd, side, otherSide) {
            // Helper used by delete
            // Removes the last item on the appropriate side from nd
            // Places that item's entries in 'this'
            if (nd[side].isNull()) {
                this.size--;
                this.key = nd.key;
                this.value = nd.value;
                return nd[otherSide];
            }
            nd[side] = this._removeLast(nd[side], side, otherSide);
            return nd.fixSize();
        },
        delete: function(key, compare) {
            var comp, side, otherSide;
            // if (node == Null) { return node; }
            comp = compare(key, this.key);
            if (comp === 0) {
                if (this.left.isNull()) { return this.right; }
                if (this.right.isNull()) { return this.left; }
                side = (Math.random() < 0.5) ? 'left' : 'right';
                otherSide = (side === 'left') ? 'right' : 'left';
                this[otherSide] = this._removeLast(this[otherSide], side, otherSide);
                return this;
            }
            side = (comp < 0) ? 'left' : 'right';
            this[side] = this[side].delete(key, compare);
            return this.fixSize();
        },
        min: function(compare) {
            return (this.left.isNull()) ? this.key : this.left.min(compare);
        },
        max: function(compare) {
            return (this.right.isNull()) ? this.key : this.right.max(compare);
        },
        floor: function(key, compare) {
            var comp = compare(key, this.key);
            if (comp == 0) { return key; }
            if (comp < 0) { return this.left.floor(key, compare); }
            return this.right.floor(key, compare) || this.key;
        },
        ceil: function(key, compare) {
            var comp = compare(key, this.key);
            if (comp == 0) { return key; }
            if (comp > 0) { return this.right.ceil(key, compare); }
            return this.left.ceil(key, compare) || this.key;
        },
        rank: function(key, compare) {
            var comp = compare(key, this.key);
            if (comp < 0) { return this.left.rank(key, compare); }
            if (comp > 0) { return this.left.size + 1 + this.right.rank(key, compare); }
            return this.left.size + 1;
        },
        select: function(k) {
            var t = this.left.size;
            if (t >= k) { return this.left.select(k); }
            if (t < k - 1) { return this.right.select(k - t - 1); }
            return this.key;
        },
        keys: function(from, to, fill, compare) {
            var comp2 = compare(this.key, to);
            if (compare(from, this.key) <= 0) {
                this.left.keys(from, to, fill, compare);
                if (comp2 <= 0) { fill.push(this.key); }
            }
            if (comp2 < 0) this.right.keys(from, to, fill, compare);
            return fill;
        },
        forEach: function(from, to, fun, compare) {
            this.left.forEach(from, to, fun, compare);
            if (compare(from, this.key) <= 0 && compare(this.key, to) <= 0) {
                fun(this.value, this.key);
            }
            return this.right.forEach(from, to, fun, compare);
        },
        isBST: function(compare) {
            return this.left.isBST(compare) && this.right.isBST(compare) &&
                (this.left.isNull() || this.left.max(compare) < this.key) &&
                (this.right.isNull() || this.right.min(compare) > this.key);
        },
        depth: function() {
            return Math.max(this.left.depth(), this.right.depth()) + 1;
        }
    }

    var Null = Node.Null = {
        isNull: function() { return true; },
        size: 0,
        fixSize: noop,
        get: noop,
        put: function(key, value) { return new Node(key ,value); },
        min: noop,
        max: noop,
        forEach: noop,
        floor: noop,
        ceil: noop,
        delete: function() { return this; },
        isBST: function() { return true; },
        depth: function() { return 0; },
        select: function() { return undefined; },
        rank: function() { return 0; }
        // TODO
    }
    
    function BST(compare) {
        this.root = Null;
        this.compare = compare || basic_compare;
    }
    BST.Node = Node;

    BST.prototype = {
        get: function(key) { return this.root.get(key, this.compare); },
        put: function(key, value) {
            this.root = this.root.put(key, value, this.compare);
            return this;
        },
        delete: function(key) {
            this.root = this.root.delete(key, this.compare);
            return this;
        },
        min: function() { return this.root.min(this.compare); },
        max: function() { return this.root.max(this.compare); },
        floor: function(key) { return this.root.floor(key, this.compare); },
        ceil: function(key) { return this.root.ceil(key, this.compare); },
        rank: function(key) { return this.root.rank(key, this.compare); },
        // Returns the key with rank n
        select: function(n) { return this.root.select(n); },
        has: function(key) { return this.get(key) !== undefined; },
        isEmpty: function() { return this.root.isNull(); },
        size: function() { return this.root.size; },
        forEach: function(from, to, fun) {
            if (typeof from === 'function') {
                return this.forEach(this.min(), this.max(), from);
            }
            from = (from == null) ? this.min() : from;
            if (typeof to === 'function') {
                return this.forEach(from , this.max(), to);
            }
            to = (to == null) ? this.max() : to;
            // Signature: fun(value, key)
            return this.root.forEach(from, to, fun, this.compare);
        },
        keys: function(from, to) {
            var fill = [];
            this.forEach(from, to, function(v, k) { fill.push(k); }, this.compare);
            return fill;
        },
        isBST: function() { return this.root.isBST(this.compare); },
        depth: function() { return this.root.depth(); }
    }
    
    return BST;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
