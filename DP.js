// Dynamic Programming implementation
// Does a recursive search from the goal problem, using a stack to keep track
// of subproblems that need to be computed
//
// The subproblems will be used as dictionary keys, so they should have a "toString"
// method gives different strings for different subproblems
//
// Input to the constructor is an object with the following properties:
//      subproblems: A function that given a problem, returns an array of the
//                   subproblems needed in its computation
//      compute:     A function that takes as input a problem and
//                   an array of "evaluated subproblems" of the form
//                   { problem: subproblem, value: value } and returns a triple
//                   { problem: problem, value: value, previous: subproblem }
//                   where previous is the subproblem that ended up being used.
//                   These previous links are used for backtracking the solution.
//      initial:     An array of the initial subproblem values, in the form:
//                   { problem: subproblem, value: value }
//
// Properties:
//      cache: Maintains a cache of computed problems. The keys are the problems, 
//             the values are triples { problem: problem, value: value, previous: subproblem }
//
// Methods:
//   constructor(subproblems, compute, initial): Initializes the problem
//   solve(targetProblem): Returns the value of the target problem, doing any necessary DP
//                         More precisely, returns a pair { value: value, solution: subproblems }
//   pending(problem):     Given a problem, returns a list of its subproblems that
//                         are pending computation.
(function(define){ 'use strict';
define(function(require) {
    
    var Stack = require('./Stack.js');
    
    function DP(obj) {
        this.subproblems = obj.subproblems;
        this.compute = obj.compute;
        this.initial = obj.initial;
        var cache = this.cache = {};   // Computed problems go here
        this.initial.forEach(function(item) {
            cache[item.problem] = {
                problem: item.problem,
                value: item.value,
                previous: null
            }
        });
    }
    
    DP.prototype = {
        solve: function(target) {
            var stack = new Stack(),
                current, subproblems,
                answer, cache = this.cache;
            stack.push(target);
            while(!stack.isEmpty()) {
                current = stack.peek();
                // console.log(current.toString());
                // console.log("Stack top: ", current);
                // console.log("Cache: ", cache)
                if (cache.hasOwnProperty(current)) {
                    // Problem already solved
                    stack.pop();
                } else {
                    subproblems = this.pending(current);
                    if (subproblems.length === 0) {
                        // All subproblems solved
                        stack.pop();
                        subproblems = this.subproblems(current).map(
                            function(prob) { return cache[prob]; }
                        );
                        cache[current] = this.compute(current, subproblems);
                    } else {
                        stack.pushAll(subproblems);
                    }
                }
            }
            // console.log(cache);
            return {
                problem: cache[target].problem,
                value: cache[target].value,
                solution: this.assemble(target)
            };
        },
        pending: function(target) {
            var subproblems = this.subproblems(target),
                cache = this.cache,
                res = [], that = this;
            subproblems.forEach(function(problem) {
                if (!cache.hasOwnProperty(problem.toString())) { res.push(problem); }
            });
            return res;
        },
        assemble: function(target) {
            // Assembling solution from a computed problem
            var arr = [], cache = this.cache, current = target;
            while (current != null) {
                arr.push(current);
                current = cache[current].previous;
            }
            return arr.reverse();
        }
    }
    
    return DP;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
