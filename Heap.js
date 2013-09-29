// Implementation of a simple heap structure
// 
// Default implementation works as min Heap. Expect a "comparator" function `isLess`:
// isLess(a, b) should return true if and only if a < b.
// Instead of a function, you can also provide a key name.
//
(function(define){ 'use strict';
define(function(require) {

    var floor = Math.floor,
        swap = function(i, j) {
        // Make sure to call it with the correct "this" binding
            var items = this.items,
                temp = items[i];
            items[i] = items[j];
            items[j] = temp;
            items[i].index = i;
            items[j].index = j;
        },
        sink = function(k) {
        // Fixes down from k.
            var j = 2 * k,
                l = this.length;
            while(j <= l) {
                if (j < l && this.comp(j + 1, j)) { j++; }
                if (!this.comp(j, k)) { break; }
                swap.call(this, k, j);
                k = j;
                j = 2 * k;
            }
            return this;
        },
        swim = function(k) {
        // Fixes up from k.
            var p = floor(k/2);
            while(p > 0) {
                if (this.comp(p, k)) { break; }
                swap.call(this, p, k);
                k = p;
                p = floor(k/2);
            }
            return this;
        },
        noop = function() { };

    function Heap(isLess, canDelete) {
        // isLess needs to be either a function f(a,b) or an object property 
        // name. It is used to determine when an object a is "less" than an
        // object b for the purposes of the heap
        // Our arrays have an extra empty value in the front, to work
        // better with the numbering that standard heap method uses.
        this.items = [null];
        this.canDelete = canDelete || false;
        // Length keeps the number of items in the heap (so 1 off from array)
        this.length = 0;
        this.isLess = (isLess == null) ?
            function(a, b) { return a < b; } :
            (
                (typeof isLess === 'function') ?
                isLess :
                function(a, b) { return a[isLess] < b[isLess]; }
            );
        // The following section provides unique IDs to keep track of object 
        // location in heap. Key used to decorate objects with their location
        // in the heap;
        if (canDelete) {
            var randomKey =
                String.fromCharCode(32 + Math.floor(Math.random() * 90 )) +
                Math.random();
            this.init = function(item) {
                var newObj = {value: item, index: ++this.length };
                Object.defineProperty(item, randomKey, {
                    configurable: true, value: newObj
                });
                return newObj;
            };
            this.getIndex = function(obj) { return obj[randomKey].index; };
            this.removeIndex = function(obj) { delete obj[randomKey]; };
        }
    }

    Heap.prototype = {
        init: function(obj) { return {value: obj, index: ++this.length }; },
        removeIndex: noop,
        comp: function(i, j) { return this.isLess(this.items[i].value, this.items[j].value); },
        get: function(i) { return this.items[i].value; },
        index: function(obj) {
            if (this.canDelete) {
                return this.getIndex(obj) || null;
            }
            for (var i = 1; i < this.length + 1; i++) {
                if (this[i].value === obj) { return i; }
            }
            return null;
        },
        size: function() { return this.items.length - 1; },
        deleteObj: function(obj) {
            // Deletes the object, by swapping it with the last entry.
            // Then either bubbles up or down as needed. Returns the deleted element.
            if (!this.canDelete) throw new Error("Cannot delete from this type of Heap.");
            var i = this.getIndex(obj);
            return (i == null) ? null : this.delete(i);
        },
        delete: function(i) {
            var obj = this.get(i);
            if (this.length == 0) throw new Error("Cannot remove from empty list.");
            swap.call(this, i, this.length);
            this.removeIndex(this.items[this.length--]);
            this.items.pop();
            if (i !== this.length + 1) {
                sink.call(this, i);
                swim.call(this, i);
            }
            return obj;
        },
        min: function() { return this.get(1); },
        extract: function() { return this.delete(1); },
        insert: function(newItem) {
            this.items.push(this.init(newItem));
            swim.call(this, this.length);
            return this;
        },
        isEmpty: function() { return this.length === 0; },
        isHeap: function() {
            for (var i = this.items.length; i-- > 2;) {
                if (this.comp(i, Math.floor(i/2))) {
                    return false;
                }
            }
            return true;
        }
    }
    
    return Heap;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
