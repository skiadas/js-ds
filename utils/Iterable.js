// Functional Programming methods for dealing with collections
// Expects to be mixed in to a class prototype
// The objects are expected to have a 'iterator' method
// which returns a pair of functions {next: ..., done: } where:
// next() returns the next item in the collection
// done() returns true if and only if we have exhausted the items in the
//        collection

(function(define){ 'use strict';
define(function(require) {
    
    /// REWRITE
    //  As a constructor that accepts either an array or an object with an
    //  iterator method.
    //  You can also mix in its prototype.
    //  It should have some "class methods" for creating some standard iterators
    //
    var Iterable = function(obj) {
        this.iterator = (obj.iterator != null) ?
            function() { return obj.iterator(); } : // Has iterator property already
            (typeof obj === 'function') ?
                obj :   // Case of a function that is the iterator
                function() { // Else treat as array
                    var i = 0;
                    return {
                        next: function() { return (i >= obj.length) ? null : obj[i++]; },
                        done: function() { return (i >= obj.length); }
                    }
                }
    }
    
    Iterable.prototype = {
        forEach: function(fun) {
            var it = this.iterator();
            while (!it.done()) { fun(it.next()); }
        },
        map: function(fun) {
            var that = this;
            return new Iterable(function() {
                var it = that.iterator();
                return {
                    next: function() { return fun(it.next()); },
                    done: function() { return it.done(); }
                }
            });
        },
        toArray: function() {
            var A = [], it = this.iterator();
            while (!it.done()) { A.push(it.next()); }
            return A;
        },
        foldl: function(fun) {
            var acc, it = this.iterator();
            if (it.done()) return undefined;
            acc = it.next();
            while (!it.done()) { acc = fun(acc, it.next()); }
            return acc;
        },
        foldr: function(fun) {
            var A = this.toArray();
            var acc = A.pop();
            while (A.length > 0) { acc = fun(A.pop(), acc); }
            return acc;
        },
        take: function(n) {
            var that = this;
            return new Iterable(function() {
                var it = that.iterator(), i = 0;
                return {
                    next: function() { return (i++ >= n) ? null : it.next(); },
                    done: function() { return (i >= n) || it.done(); }
                }
            });
        },
        skip: function(n) { 
            var that = this;
            return new Iterable(function() {
                    var it = that.iterator();
                    while (n-- > 0) { it.next(); }
                    return it;
                });
         },
        slice: function(a, b) {
            // Starts from a. Stops before b
            var that = this;
            return new Iterable(function() {
                var it = that.iterator(), i = 0;
                while (i++ < a) { it.next(); }
                return {
                    next: function() { return (i++ >= b) ? null : it.next(); },
                    done: function() { return (i >= b) || it.done(); }
                }
            });
        }
    }
    
    return Iterable;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
