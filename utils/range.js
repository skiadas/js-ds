// Simple function offering range-based functionality
// 
// Initializing:
// r = range(a, b);               // Represents range of numbers from a and increasing by 1
//                                // until it exceeds b
//                                // If a > b, it will default to counting down by step -1
// r = range(b);                  // same as range(0, b);
// r = range(a, b, step);         // increases by step a
//
// Usage:
// r.each(fun);                   // same as a for loop. Fun recieves the index as argument
// r.map(fun);                    // Assemples the results in an array
// r.reduce(fun, accum, start);
// 

(function(define){ 'use strict';
define(function(require) {

    var Range = function(a, b, step) {
        this.a = a;
        this.b = b;
        this.step = step;
        if (this.step == null) { this.step =  (a <= b) ? 1 : -1; }
        if (typeof this.step !== 'function') {
            this.step = range.step_add(this.step);
        }
        this.stop = (a <= b) ?
                function(i) { return i > b; } :
                function(i) { return i < b; }
    }
    
    Range.prototype = {
        each: function(fun) {
            var i = this.a, stop = this.stop, step = this.step;
            while (!stop(i)) { fun(i); i = step(i); }
            return this;
        },
        map: function(fun) {
            var A = [];
            if (fun == null) { fun = function(i) { return i; }}
            this.each(function(i) { A.push(fun(i)); });
            return A;
        }
    }

    var range = function(a, b, step) {
        if (arguments.length === 0) return null;
        if (arguments.length === 1) { return new Range(0, a); }
        return new Range(a, b, step);
    }

    range.step_add = function(step) { return function(i) { return step + i; } }
    range.step_mult = function(step) { return function(i) { return step * i; } }

    return range;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
