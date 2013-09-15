(function(define){ 'use strict';
define(function(require) {
    
    var DLL = require('./DLList.js');
    
    function Queue() {
        this.list = new DLL();
    }
    
    Queue.prototype = {
        enqueue: function(item) {
            this.list.addFirst(item);
            return this;
        },
        dequeue: function() { return this.list.removeLast(); },
        isEmpty: function() { return this.list.size === 0; },
        each: function(fun, andPop) {
            var it;
            if (!andPop) {
                this.list.ach(fun);
                return this;
            }
            while (!this.isEmpty()) {
                it = this.dequeue();
                fun.call(it, it);
            }
        }
    }
    
    return Queue;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
