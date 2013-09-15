(function(define){ 'use strict';
define(function(require) {
    var Tree = require('./Tree.js');
    
    function Heap(isLess) {
        this.items = new Tree();
        this.isLess = (typeof isLess === 'function') ?
            isLess :
            function(a, b) { return a[isLess] < b[isLess]; };
        // The following section provides unique IDs to keep track of object 
        // location in heap. Key used to decorate objects with their location
        // in the heap;
        var randomKey =
            String.fromCharCode(32 + Math.floor(Math.random() * 90 )) +
            Math.random();
        this.setKey = function(obj, value) {
            if (obj[randomKey]) { console.log("oops")}
            Object.defineProperty(obj, randomKey, {
                configurable: true,
                writable: true,
                value: value
            });
        }
        this.getKey = function(obj) { return obj[randomKey]; }
        this.removeKey = function(obj) { delete obj[randomKey]; }
    }
    
    Heap.prototype = {
        has: function(obj) {
            return (this.getKey(obj) != null);
        },
        fixNode: function(node) {
            
        },
        lastElement: function() {
            
        },
        insert: function(item) {
            var setKey = this.setKey;
            this.items.add(item, null, function(node) {
                setKey(item, node);
                // Heap property fixing
                this.fixNode(node);
            });
            return this;
        },
        extract: function() {
            var node = this.items.root,
                last = this.lastElement().detach();
            this.items.root = last;
            last.forceLeft(node.left).forceRight(node.right);
            this.fixNode(last);
            return node;
        },
        delete: function(obj) {
            if (!this.has(obj)) return;
            var node = this.getKey(obj),
                last = this.lastElement();
        },
        isEmpty: function() {
            
        },
        lead: function() {
            
        }
    }
    
    return Heap;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));

