(function(define){ 'use strict';
define(function(require) {

    var utils = {
        extend: function(object, other) {
            var args = Array.prototype.slice.call(arguments, 1),
                i, k;
            for (i = 0; i < args.length; i++) {
                for (k in args[i]) {
                    if (args[i].hasOwnProperty(k)) { object[k] = args[i][k]; }
                }
            }
        }
    }
    return utils;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
