// Library of array sort methods
// They all require a "compare(a,b)" function that needs to return -1, 0, 1
// Can instead provide a "key" string, in which case its values will be used with
// their default order
// If completely omitted, it is assumed that the elements of the array respond to "a < b"
// All sorts sort in place the array that is passed to them, and return it

(function(define){ 'use strict';
define(function(require) {
    function standardCompare(a, b) {
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
    }
    function keyCompare(key) {
        return function(a, b) {
            return (a[key] < b[key]) ? -1 : ((a[key] > b[key]) ? 1 : 0);
        }
    }
    function makeComparator(compare) {
        switch (typeof compare) {
        case 'undefined':
            return standardCompare;
        case 'string':
            return keyCompare(compare);
        default:
            return compare;
        }
    }
    
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    var Sort = {
        isSorted: function(arr, compare) {
            var i, l = arr.length;
            compare = makeComparator(compare);
            for (var i = 0; i < l; i++) {
                if (compare(arr[i], arr[i+1]) === 1) return false;
            }
            return true;
        },
        insertionSort: function(arr, compare) {
            compare = makeComparator(compare);
            var i, j, l = arr.length;
            for (i = 1; i < arr.length; i++) {
                j = i;
                while (j > 0 && (compare(arr[j-1], arr[j]) === 1))
                    swap(arr, j - 1, j--);
            }
            return arr;
        },
        shellSort: function(arr, compare) {
            // Uses h = 1+3k
            compare = makeComparator(compare);
            var l = arr.length,
                h = 1, i, j;
            while (h < l) { h = 3 * h + 1; }
            while (h > 1) {
                h = (h - 1) / 3;
                for (i = h; i < l; i++) {
                    j = i;
                    while (j > 0 && (compare(arr[j-h], arr[j]) === 1)) {
                        swap(arr, j - h, j);
                        j -= h;
                    }
                }
            }
            return arr;
        },
        mergeSort: function(arr, compare) {
            // Bottom-up implementation of mergeSort
            compare = makeComparator(compare);
            var l = arr.length,
                aux = new Array(l),
                sz = 1, lo = 0;
            function merge(arr, lo, mid, hi) {
                var i, j, k;
                for (i = lo; i < hi + 1; i++) { aux[i] = arr[i]; }
                i = k = lo; j = mid + 1;
                while (k <= hi) {
                    if (i > mid)          { arr[k++] = aux[j++]; }
                    else if (j > hi)      { arr[k++] = aux[i++]; }
                    else if (compare(aux[i], aux[j]) === 1) { arr[k++] = aux[j++]; }
                    else                  { arr[k++] = aux[i++]; }
                }
            }
            for (sz = 1; sz < l; sz = 2 * sz ) {
                for (lo = 0; lo < l - sz; lo += 2 * sz) {
                    merge(arr, lo, lo + sz - 1, Math.min(lo + 2 * sz - 1, l - 1));
                }
            }
            return arr;
        },
        shuffle: function(arr) {
            // Uniform Shuffle of the array
            var i = 0, l = arr.length;
            for (i = 0; i < l; i++) {
                swap(arr, i, Math.floor(Math.random() * (i + 1)));
            }
            return arr;
        },
        quickSort: function(arr, compare) {
            compare = makeComparator(compare);
            Sort.shuffle(arr);
            function sort(arr, lo, hi) {
                if (lo >= hi) { return arr; }
                var i = lo + 1, j = hi, pivot = arr[lo];
                while (i <= j) {
                    // console.log(i, j)
                    while (compare(arr[i], pivot) !== 1 && i < hi + 1) { i++; }
                    while (compare(arr[j], pivot) !== -1 && j > lo) { j--; }
                    if (i >= j) { break; }
                    swap(arr, i, j);
                }
                swap(arr, lo, j);
                // console.log(lo, j, hi);
                sort(arr, lo, j - 1);
                sort(arr, j + 1, hi);
                return arr;
            }
            return sort(arr, 0, arr.length - 1);
        },
        quickSort3way: function(arr, compare) {
            compare = makeComparator(compare);
            Sort.shuffle(arr);
            function sort(arr, lo, hi) {
                if (lo >= hi) { return arr; }
                var lt = lo, gt = hi, i = lt, pivot = arr[lo], comp;
                while (i <= gt) {
                    comp = compare(arr[i], pivot);
                    if (comp === 1) { swap(arr, i, gt--); }
                    else if (comp === -1) { swap(arr, lt++, i++); }
                    else { i++; }
                }
                sort(arr, lo, lt - 1);
                sort(arr, gt + 1, hi);
                return arr;
            }
            return sort(arr, 0, arr.length - 1);
        }
    }
    
    return Sort;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
