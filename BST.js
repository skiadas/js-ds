// Implementation of a binary search tree
// 
// Expect a "comparator" function `compare` to compare keys:
// compare(a, b) should return < 0 if a < b, > 0 if a > b, = 0 if a==b.
// Instead of a function, you can also provide a key name.
// If omitted, we assume keys react to "<"
//
(function(define){ 'use strict';
define(function(require) {

    function basic_compare(a, b) {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
    }

    function _put(node, key, value) {
        if (node == null) { return new Node(key ,value); }
        var comp = this.compare(key, node.key);
        if (comp === 0) {
            node.value = value;
        } else {
            var side = (comp < 0) ? 'left' : 'right';
            node[side] =  _put.call(this, node[side], key, value);
        }
        return node.fixSize();
    }
    function _get(node, key) {
        if (node == null) { return undefined; }
        var comp = this.compare(key, node.key);
        if (comp < 0) return _get.call(this, node.left, key);
        if (comp > 0) return _get.call(this, node.right, key);
        return node.value;
    }
    function _delete(node, key) {
        var comp, side, otherSide, newBase;
        var removeLast = function(nd) {
            if (nd[side] == null) {
                newBase = nd;
                return nd[otherSide];
            }
            nd[side] = removeLast(nd[side]);
            return nd.fixSize();
        }
        if (node == null) { return node; }
        comp = this.compare(key, node.key);
        if (comp === 0) {
            if (node.left == null) { return node.right; }
            if (node.right == null) { return node.left; }
            side = (Math.random() < 0.5) ? 'left' : 'right';
            otherSide = (side === 'left') ? 'right' : 'left';
            // Replacing node with its predecessor
            node[otherSide] = removeLast(node[otherSide]);
            newBase.left = node.left;
            newBase.right = node.right;
            // Uncheck if you find it leaks memory
            // node.left = node.right = null; 
            return newBase.fixSize();
        }
        side = (comp < 0) ? 'left' : 'right';
        node[side] = _delete.call(this, node[side], key);
        return node.fixSize();
    }
    function _floor(node, key) {
        if (node == null) { return undefined; }
        var comp = this.compare(key, node.key);
        if (comp == 0) { return key; }
        if (comp < 0) { return _floor.call(this, node.left, key); }
        return _floor.call(this, node.right, key) || node.key;
    }
    function _ceil(node, key) {
        if (node == null) { return undefined; }
        var comp = this.compare(key, node.key);
        if (comp == 0) { return key; }
        if (comp > 0) { return _ceil.call(this, node.right, key); }
        return _ceil.call(this, node.left, key) || node.key;
    }
    function _keys(node, from, to, fill) {
        if (node == null) { return fill; }
        var comp1 = this.compare(from, node.key),
            comp2 = this.compare(node.key, to);
        if (comp1 <= 0) {
            _keys.call(this, node.left, from, to, fill);
            if (comp2 <=0) { fill.push(node.key); }
        }
        if (comp2 < 0) _keys.call(this, node.right, from, to, fill);
        return fill;
    }
    function _forEach(node, from, to, fun) {
        if (node == null) { return; }
        var comp1 = this.compare(from, node.key),
            comp2 = this.compare(node.key, to);
        if (comp1 <= 0) {
            _forEach.call(this, node.left, from, to, fun);
            if (comp2 <=0) { fun(node.value, node.key); }
        }
        if (comp2 < 0) _forEach.call(this, node.right, from, to, fun);
        return;
    }

    function Node(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
        this.size = 1;
    }
    
    Node.prototype = {
        fixSize: function() {
            this.size = ((this.left && this.left.size) || 0) +
                        ((this.right && this.right.size) || 0) + 1;
            return this;
        }
    }

    function BST(compare) {
        this.root = null;
        this.compare = compare || basic_compare;
    }

    BST.prototype = {
        get: function(key) { return _get.call(this, this.root, key); },
        put: function(key, value) {
            this.root = _put.call(this, this.root, key, value);
            return this;
        },
        delete: function(key) {
            this.root = _delete.call(this, this.root, key);
            return this;
        },
        min: function() {
            if (this.root == null) { return undefined; }
            var node = this.root;
            while (node.left != null) { node = node.left; }
            return node.key;
        },
        max: function() {
            if (this.root == null) { return undefined; }
            var node = this.root;
            while (node.right != null) { node = node.right; }
            return node.key;
        },
        floor: function(key) { return _floor.call(this, this.root, key); },
        ceil: function(key) { return _ceil.call(this, this.root, key); },
        rank: function(key) {
            
        },
        select: function(int) {
            // The key with rank int
        },
        has: function(key) { return this.get(key) !== undefined; },
        isEmpty: function() { return this.root === null; },
        size: function() { return this.root === null ? 0 : this.root.size; },
        forEach: function(from, to, fun) {
            if (typeof from === 'function') {
                fun = from;
                from = null;
            } else if (typeof to === 'function') {
                fun = to;
                to = null;
            }
            from = (from == null) ? this.min() : from;
            to = (to == null) ? this.max() : to;
            // Signature: fun(value, key)
            _forEach.call(this, this.root, from, to, fun);
        },
        keys: function(from, to) {
            from = (from == null) ? this.min() : from;
            to = (to == null) ? this.max() : to;
            return _keys.call(this, this.root, from, to, []);
        }
    }
    
    return BST;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
