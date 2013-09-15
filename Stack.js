(function(define){ 'use strict';
define(function(require) {
    
    var DLL = require('./DLList.js');
    
    function Stack() {
        this.list = new DLL();
    }
    
    Stack.prototype = {
        push: function(item) {
            this.list.addLast(item);
            return this;
        },
        pop: function() { return this.list.removeLast(); },
        isEmpty: function() { return this.list.size === 0; },
        each: function(fun, andPop) {
            var it;
            if (!andPop) {
                this.list.revEach(fun);
                return this;
            }
            while (!this.isEmpty()) {
                it = this.pop();
                fun.call(it, it);
            }
        }
    }
    
    return Stack;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
