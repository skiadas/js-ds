// Set class
// Assumes the elements are either strings or have a toString method.
// Also the set's string representation assumes the element strings
// don't contain curly braces or commas.

(function(define){ 'use strict';
define(function(require) {
    
    function Set(arr) {
        this._elements = {};
        var that = this;
        if (arr != null && arr.length != null) {
            arr.forEach(function(k) { that.add(k); });
        }
    }
    
    Set.prototype = {
        add: function(k) {
            this._elements[k] = k;
            return this;
        },
        delete: function(k) {
            var val = this._elements[k];
            delete this._elements[k];
            return val;
        },
        contains: function(k) {
            return this._elements.hasOwnProperty(k.toString());
        },
        intersection: function(set) {
            if (arguments.length > 1) {
                return this.intersection.apply(
                    this.intersection(set),
                    [].slice.call(arguments, 1)
                );
            }
            var ret = new Set(), els = this._elements;
            for (var k in els) {
                if (els.hasOwnProperty(k) && set.contains(k)) {
                    ret.add(els[k]);
                }
            }
            return ret;
        },
        union: function(set) {
            if (arguments.length > 1) {
                return this.union.apply(
                    this.union(set),
                    [].slice.call(arguments, 1)
                );
            }
            var ret = set.clone(), els = this._elements;
            for (var k in els) {
                if (els.hasOwnProperty(k)) { ret.add(els[k]); }
            }
            return ret;
        },
        complement: function(universe) {
            return universe.difference(this);
        },
        difference: function(set) {
            var ret = new Set(), els = this._elements;
            for (var k in els) {
                if (els.hasOwnProperty(k) && !set.contains(k)) {
                    ret.add(els[k]);
                }
            }
            return ret;
        },
        without: function(key) {
            return this.difference(new Set([key]));
        },
        elements: function() {
            var arr = [], els = this._elements;
            for (var k in els) {
                if (els.hasOwnProperty(k)) { arr.push(els[k]); }
            }
            return arr;
        },
        keys: function() {
            var arr = [], els = this._elements;
            for (var k in els) { if (els.hasOwnProperty(k)) { arr.push(k); } }
            return arr;
        },
        toString: function() {
            return '{' + this.keys().sort().join(', ') + '}';
        },
        clone: function() { return new Set(this.elements()); }
    }

    // Aliases
    Set.prototype.has = Set.prototype.contains;
    
    return Set;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
