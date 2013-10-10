A library implementing various data structures in Javascript. Decomposed into AMD modules. Can be used as individual pieces, or all in one piece.

# Overview

The library so far contains constructors for the following structures:

1. [Iterable](#the-iterable-mixin)
1. [Stacks](#stacks)
2. Queues
3. Doubly Linked Lists
4. Heaps
5. Union-Find
6. Binary Search Trees
7. Red-Black trees
8. Sorting Algorithms
9. Algorithms dealing with graphs

## The Iterable Mixin

The [Iterable](utils/Iterable.js) mixin is a set of methods for manipulating "iterable objects". For the purposes of the mixin, an iterable object needs to have an `iterator` function, which when called returns an object with two methods, `next` and `done`. Most mixin methods return an iterable object. A `toArray` method returns an array from an iterable.

1. `forEach(fun)` calls `fun` for each 'element' of the iterable.
2. `map(fun)` passes the iterable's values through `fun`. Returns an iterable.
3. `toArray()` returns an array of the values in the iterable.
4. `foldl(fun)` performs a `fold left`. The function needs to have signature `fun(acc, item)`.
5. `foldr(fun)` performs a `fold right`. The function needs to have signature `fun(item, acc)`.
6. `take(n)` returns the first `n` elements of the iterable, as an iterable.
7. `skip(n)` skips the first `n` elements of the iterable. Returns an iterable.
8. `slice(a, b)` skips the first `a` elements, then returns all elements until we've exceeded a total of b elements. E.g. slice(2, 5) will return the 2nd through 4th elements.

The Iterable mixing also comes with a constructor to build an iterable object out of an array or an `iterator` function, and also comes with built-in class methods for constructing standard (possibly infinite) iterable objects (for example the sequence 1,2,3,...).

## Stacks

Implemented in [Stack.js](Stack.js), Stacks use a doubly-linked list to provide a standard stack interface. All methods except iteration take constant time. The following methods are implemented:

* `push(item)` pushes the item at the top of the stack.
* `pushAll(array)` push all items from the array at the top of the stack. Anything with a `forEach` method would do.
* `pop()` removes and returns the item at the top of the stack.
* `peek()` returns the item at the top of the stack, without removing it.
* `isEmpty()` returns `true` if and only if the stack has no items.
* `processAll(fun)` iterates over the elements in the stack, calling `fun` on each. The elements are removed at the same time, resulting in an empty stack.
* `iterator()` returns an iterator for the stack, which allows usage of the Iterable mixin

### Examples

```javascript
var Stack = require('Stack.js'),
    stack = new Stack();
    
stack.pushAll([1,2,3]);
stack.push(4);
stack.pop();             // ----> 4
stack.peek();            // ----> 3 but does not remove it
stack.each(console.log); // ----> 3 2 1
```

