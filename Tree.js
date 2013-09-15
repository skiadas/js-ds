// Rudimentary binary tree structure.
// Meant to be extended
// Perhaps should extend to arbitrary width
(function(define){ 'use strict';
define(function(require) {

    function Node(item) {
        // If node is the first node in tree, set parent to be the tree instance
        this.item = item;
        this.size = 1;
        this.parent = null;
        this.left = null;
        this.right = null;
    }
    Node.prototype = {
        isNode: function() { return true; },
        isRoot: function() { return !this.parent.isNode(); },
        adjustSize: function(amount) {
            // Recursively adjusts the size moving up.
            // Tree class overwrites this at the root
            this.size += amount;
            this.parent.adjustSize(amount);
            return this;
        },
        fixSize: function() {
            // Reverifies sizes starting from node and moving up.
            this.size = 1;
            this.left && (this.size += this.left.size);
            this.right && (this.size += this.right.size);
            this.parent.fixSize();
            return this;
        },
        parentSide: function() {
            // Returns the side in the parent this is in
            return (this.isRoot()) ? 'root' :
                        ((this.parent.left === this) ? 'left' : 'right');
        },
        sibling: function() {
            // Returns the sibling of node;
            var p = this.parent;
            if (p.isNode()) {
                return (this === p.left) ? p.right : p.left;
            }
            return null;
        },
        detach: function() {
            // Removes node from its parent
            var parent = this.parent;
            parent[this.parentSide()] = null;
            this.parent = null;
            parent.adjustSize(-this.size);
            return this;
        },
        swapWithParent: function() {
            console.log("Gotcha!")
        },
        rotateRight: function() {
            // Promote's the node's left child to be the parent
        },
        rotateLeft: function() {
            // Promote's the node's right child to be the parent
        }
    }

    function BinTree() {
        this.root = null;
    }
    BinTree.prototype = {
        isNode: function() { return false; },
        isEmpty: function() { return this.root === null; },
        add: function(item, annotate) { 
            // Creates a new node, annotates it if provided, calls the insert method
            // Returns the newly created node
            // Overwrite "insert" to determine where to place the node
            var node = new Node(item);
            if (annotate) annotate.call(node, node);
            this.insert(node);
            return node;
        },
        insert: function(node) {
            // Actually inserts node into the tree
            // Can and should be overwritten depending on the tree's desired properties
            if (!this.root) {
                this.root = node;
                node.parent = this;
            } else {
                var here = this.root;
                while (true) {
                    if (!here.left) {
                        here.left = node;
                        break;
                    } else if (!here.right) {
                        here.right = node;
                        break;
                    } else if (here.right.size < here.left.size) {
                        here = here.right;
                    } else {
                        here = here.left;
                    }
                }
                node.parent = here;
                here.adjustSize(node.size);
            }
            return this;
        },
        set: function(node) {
            // sets node to be root. Detaches any existing root.
            if (this.root) { this.root.detach(); }
            this.root = node;
            node.parent = this;
        },
        size: function() {
            return (this.root && this.root.size) || 0;
        },
        adjustSize: function() { return this; },
        fixSize: function() { return this; }
    }

    return BinTree;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));

