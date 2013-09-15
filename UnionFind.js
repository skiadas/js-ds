//
// Union-Find algorithm Implementation
// Uses quick-union with weighting and path shortening
//
(function(define){ 'use strict';
define(function(require) {

    function UF(N, options) {
        if (!(this instanceof UF)) { return new UF(N); }
        var id = this.id = new Array(N),
            s = this.size = new Array(N),
            opts = this.options = options || {};
        this.count = N;
        for (var i = 0; i < N; i++) { id[i] = i; s[i] = 1; }
        if (opts.preventHandlers) this._handle = function() { };
    }
    
    UF.prototype = {
        find: function(i) {
            var id = this.id,
                root = i, p;
            while (root !== id[root]) { root = id[root]; }
            while (i !== root) { p = id[i]; id[i] = root; i = p; }
            return root;
        },
        connected: function(i, j) {
            return this.find(i) === this.find(j);
        },
        validate: function(i) {
            if (i < 0 || i >= this.size.length)
                throw new RangeError("Index out of bounds: " + i);
            return i;
        },
        union: function(i, j) {
            var id = this.id,
                s = this.size,
                a = this.find(this.validate(i)),
                b = this.find(this.validate(j));
            if (a === b) return;
            if (s[a] < s[b]) {
                id[a] = id[b]; s[b] += s[a]; this._handle(a, b);
            } else {
                id[b] = id[a]; s[a] += s[b]; this._handle(b, a);
            }
            this.count--;
            return this;
        },
        _handle: function(a, b) {
            if (this.handlers) {
                for (var i = 0, h = this.handlers, l = h.length; i < l; i++) {
                    h[i].call(this, a, b);
                }
            }
        },
        addHandler: function(handler) {
            // Allows adding custom handlers to maintain state information.
            // The handler is called with parameters a, b whenever the
            // tree rooted at a merges with the tree rooted at b.
            // The handler's context is set to the UF object instance itself.
            // Multiple handlers may be attached.
            if (this.options.preventHandlers) return;
            this.handlers = this.handlers || [];
            this.handlers.push(handler);
        }
    }
    
    return UF;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));