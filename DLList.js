// Implementation of Doubly-linked list
(function(define){ 'use strict';
define(function(require) {

    function Node(item, prev, next) {
        this.item = item;
        this.prev = prev;
        this.next = next;
    }
    
    function DLL() {
        var sentinel = this.sentinel = new Node(null);
        sentinel.next = sentinel.prev = sentinel;
        this.size = 0;
    }
    
    DLL.prototype = {
        isEmpty: function() { return this.size === 0; },
        first: function() {
            return this.sentinel.next.item;
        },
        last: function() {
            return this.sentinel.prev.item;
        },
        addFirst: function(item) {
            return this.insertNode(item, this.sentinel);
        },
        addLast: function(item) {
            return this.insertNode(item, this.sentinel.prev);
        },
        removeFirst: function() {
            return this.removeNode(this.sentinel.next);
        },
        removeLast: function() {
            return this.removeNode(this.sentinel.prev);
        },
        removeNode: function(node) {
            if (node === this.sentinel) throw new RangeError("Cannot remove from empty list.");
            node.prev.next = node.next;
            node.next.prev = node.prev;
            this.size--;
            return node.item;
        },
        insertNode: function(item, after) {
            var node = new Node(item, after, after.next);
            after.next = after.next.prev = node;
            this.size++;
            return this;
        },
        each: function(fun) {
            var s = this.sentinel,
                it = s;
            while ((it = it.next) !== s) fun.call(it.item, it.item);
            return this;
        },
        revEach: function(fun) {
            var s = this.sentinel,
                it = s;
            while ((it = it.prev) !== s) fun.call(it.item, it.item);
            return this;
        },
        iterator: function(reverse) {
            var sent = this.sentinel,
                that = sent,
                dir = (reverse === true) ? 'prev' : 'next';
            return {
                next: function next() {
                    return (that[dir] === sent) ? null : (that = that[dir]).item;
                },
                done: function done() { return that[dir] === sent; }
            }
        }
    }
    
    return DLL;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
