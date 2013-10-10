(function(define){ 'use strict';
define(function(require) {
    
    var DLL = require('./DLList.js'),
        object = require('./utils/object.js'),
        Iterable = require('./utils/Iterable.js');
    
    
    function Stack() { this.list = new DLL(); }
    
    Stack.prototype = {
        push: function(item) {
            this.list.addLast(item);
            return this;
        },
        pushAll: function(arr) {
            var list = this.list;
            arr.forEach(function(item) { list.addLast(item); });
        },
        pop: function() { return this.list.removeLast(); },
        peek: function() { return this.list.last() },
        isEmpty: function() { return this.list.size === 0; },
        processAll: function(fun) {
            var it;
            while (!this.isEmpty()) {
                it = this.pop();
                fun.call(it, it);
            }
        },
        iterator: function() {
            return this.list.iterator(true);
        }
    }
    
    object.extend(Stack.prototype, Iterable.iterable);
    return Stack;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
