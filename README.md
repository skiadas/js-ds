A library implementing various data structures in Javascript. Decomposed into AMD modules. Can be used as individual pieces, or all in one piece.

# Overview

The library so far contains constructors for the following structures:

1. [Stacks](#stacks)
2. Queues
3. Doubly Linked Lists
4. Heaps
5. Union-Find
6. Binary Search Trees
7. Red-Black trees
8. Sorting Algorithms
9. Algorithms dealing with graphs

## Stacks

Implemented in [Stack.js](Stack.js), Stacks use a doubly-linked list to provide a standard stack interface. All methods except iteration take constant time. The following methods are implemented:

* `push(item)` pushes the item at the top of the stack.
* `pushAll(array)` push all items from the array at the top of the stack. Anything with a `forEach` method would do.
* `pop()` removes and returns the item at the top of the stack.
* `peek()` returns the item at the top of the stack, without removing it.
* `isEmpty()` returns `true` if and only if the stack has no items.
* `each(fun, andPop)` iterates over the elements in the stack, calling `fun` on each. If `andPop` is `true` (defaults to `false`), the elements are removed at the same time, resulting in an empty stack.
* `forEach(fun, andPop)` alias for `each`.

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

