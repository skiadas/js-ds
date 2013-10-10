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
    
    // Helper functions
    Iterable.func = {
        false: function() { return false; },
        true: function() { return true; },
        "+": function(a, b) { return a + b; },
        "-": function(a, b) { return a - b; },
        "*": function(a, b) { return a * b; },
        "/": function(a, b) { return a / b; }
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
        },
        accumulate: function(fun) {
            // Accumulates the values at each step, calling fun(accum, newItem)
            // for each new value
            fun = Iterable.func[fun] || fun;
            var that = this;
            return new Iterable(function() {
                var it = that.iterator(), acc;
                return {
                    next: function() {
                        return (
                            acc = (acc == null) ?
                                it.next() :
                                fun(acc, it.next())
                        );
                    },
                    done: function() { return it.done(); }
                }
            });
        }
    }
    
    // Class methods for constructing standard iterables
    Iterable.seq = function(start, step) {
        // When called with one parameter, that parameter is the step
        if (step == null) { step = start; start = 0; }
        if (step == null) { step = 1; }
        start = start - step;
        return new Iterable(function() {
            var i = start;
            return {
                next: function() { return (start = start + step); },
                done: function() { return false; }
            }
        });
    }
    Iterable.repeat = function(val, times) {
        if (times == null) { times = Infinity; }
        return new Iterable(function() {
            var i = 0;
            return {
                next: function() { return (i++ >= times) ? null : val; },
                done: function() { return (i >= times); }
            }
        });
    }
    Iterable.unif = function(a, b) {
        if (b == null) { b = a; a = 0; }
        if (b == null) { b = 1; }
        return new Iterable(function() {
            return {
                next: function() { return a + Math.random() * (b-a); },
                done: function() { return false; }
            }
        });
    }
    
    return Iterable;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
