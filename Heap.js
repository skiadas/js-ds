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
            var a = this.get(i),
                b = this.get(j);
            this.set(i, b);
            this.set(j, a);
        },
        fix = function(obj) {
        // Attempts to fix situation rooted at obj. Moves up or down accordingly
        var i = this.getIndex(obj),
            left = 2*i, right = 2*i + 1,
            lItem = this.get(left),
            rItem = this.get(right),
            curr = this.get(i),
            par = floor(i/2),
            isLess = this.isLess;
        // console.log(lItem, rItem, curr, par, par >= 1 && this.get(par));
        if (lItem && rItem && isLess(rItem, lItem) && isLess(rItem, curr)) {
                swap.call(this, i, right);
        } else if (lItem && isLess(lItem, curr)) {
            swap.call(this, i, left);
        } else if (par >= 1 && isLess(curr, this.get(par))) {
            swap.call(this, i, par);
        } else { // Nothing to fix
            return this;
        }
        return fix.call(this, obj);
    }

    function Heap(isLess) {
        // isLess needs to be either a function f(a,b) or an object property 
        // name. It is used to determine when an object a is "less" than an
        // object b for the purposes of the heap
        // Our arrays have an extra empty value in the front, to work
        // better with the numbering that standard heap method uses.
        this.items = [null];
        // Length keeps the number of items in the heap (so 1 off from array)
        this.length = 0;
        this.isLess = (typeof isLess === 'function') ?
            isLess :
            function(a, b) { return a[isLess] < b[isLess]; };
        // The following section provides unique IDs to keep track of object 
        // location in heap. Key used to decorate objects with their location
        // in the heap;
        var randomKey =
            String.fromCharCode(32 + Math.floor(Math.random() * 90 )) +
            Math.random();
        this.init = function(obj, index) {
            if (obj[randomKey]) { console.log("oops")}
            Object.defineProperty(obj, randomKey, {
                configurable: true,
                writable: true,
                value: index
            });
        }
        this.setIndex = function(obj, index) {
            obj[randomKey] = index;
        }
        this.getIndex = function(obj) { return obj[randomKey]; }
        this.removeIndex = function(obj) { delete obj[randomKey]; }
    }

    Heap.prototype = {
        get: function(i) {
            return (i != null) ? this.items[i] : this.items.slice(1);
        },
        set: function(i, val) {
            this.items[i] = val;
            if (i === this.length + 1) {
                this.init(val, i);
                this.length++;
                fix.call(this, val); 
            } else {
                this.setIndex(val, i);
            }
            return this;
        },
        has: function(obj) {
            return (this.getIndex(obj) != null);
        },
        pop: function() {
            if (this.length == 0) throw new Error("Cannot remove from empty list.");
            this.removeIndex(this.items[this.length--]);
            return this.items.pop();
        },
        delete: function(obj) {
            // Deletes the object, by swapping it with the last entry.
            // Then either bubbles up or down as needed. Returns the deleted element.
            var i = this.getIndex(obj);
            if (!(i > 0 && i <= this.length)) { return; }
            swap.call(this, i, this.length);
            this.pop();
            if (i - 1 !== this.length && this.length > 0) fix.call(this, this.get(i));
            return obj;
        },
        leadvalue: function() { return this.get(1); },
        extract: function() { return this.delete(this.get(1)); },
        insert: function(newItem) {
            this.set(this.length + 1, newItem);
            return this;
        },
        isEmpty: function() {
            return this.length === 0;
        }
    }
    
    return Heap;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
