// Simple Stopwatch class
// Keeps a list of recorded time intervals.
// 
//      sw = new Stopwatch(); // Starts a new stopwatch instance. Paused by default
//      sw.lap();             // Starts counting a new time interval.
//                            // Stores any previous time interval
//      sw.reset();           // Resets current time interval
//      sw.elapsed();         // time elapsed in current time interval, in ms
//      sw.total();           // Total time in all intervals
//      sw.laps;              // Array of previous times, in ms
//      sw.clear();           // Compelely resets the stopwatch
//
//      TODO: Add simple statistics
//
(function(define){ 'use strict';
define(function(require) {

    var Stopwatch = function() {
        this.clear();
    }
    
    Stopwatch.prototype = {
        lap: function() {
            var now = new Date(), current;
            if (this.last != null) {
                current = now - this.last;
                this.laps.push(current);
                this.pastTotal += current;
            }
            this.last = now;
            return this;
        },
        reset: function() {
            this.last = new Date();
            return this;
        },
        elapsed: function() {
            return (this.last == null) ? 0 : new Date() - this.last;
        },
        total: function() {
            return this.pastTotal + this.elapsed();
        },
        clear: function() {
            this.laps = [];
            this.last = null;
            this.pastTotal = 0;
            return this;
        }
    }

    return Stopwatch;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
