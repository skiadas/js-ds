(function(define){ 'use strict';
define(function(require) {

     function Graph(options) {
        this.vertices = [];
        this.options = options || {};
        if (!this.options.hasOwnProperty('directed'))
            this.options.directed = false;
    }
    
    Graph.prototype = {
        vertex: function(i) {
            return this.vertices[i];
        },
        outgoing: function(i) {
            return this.vertex(i).edges;
        },
        addVertex: function(i) {
            this.vertices[i] = this.vertices[i] || { vertex: i, edges: [] };
        },
        addEdge: function(i, j, weight) {
            this.addVertex(i);
            this.addVertex(j);
            this.outgoing(i).push({ start: i, end: j, weight: weight || 1 });
            if (!this.options.directed)
                this.outgoing(j).push({ start: j, end: i, weight: weight || 1 });
        },
        totalWeight: function() {
            var totalWeight = 0;
            for (var i = 1; i < this.vertices.length ; i++) {
                this.vertex(i).edges.forEach(function(edge) {
                    totalWeight += edge.weight;
                });
            }
            if (!this.options.directed) { totalWeight = totalWeight / 2; }
            return totalWeight;
        },
        MSTPrim: function() {
            var T = new Graph();
            var vHeap = new (require('./Heap.js'))("weight");
            for (var i = 2; i < this.vertices.length; i++) {
                this.vertex(i).weight = Infinity;
            }
            this.vertex(1).weight = 0;

            vHeap.insert(this.vertex(1));
            while (vHeap.length !== 0) {
                var v = vHeap.extract();
                T.addVertex(v.vertex);
                var e = v.weightEdge;
                if (e) { T.addEdge(e.start, e.end, e.weight); }
                var that = this;
                v.edges.forEach(function(e) {
                    var w = that.vertex(e.end);
                    if (vHeap.has(w)) { vHeap.delete(w); }
                    if (!T.vertex(w.vertex)) {
                        // Vertex not yet in X. But is now connected to X.
                        // Need to possibly adjust its weight. Then put it in heap
                        if (w.weight > e.weight) {
                            w.weight = e.weight; w.weightEdge = e;
                        }
                        vHeap.insert(w);
                    }
                });
            }
            for (i = 1; i < this.vertices.length; i++) {
                delete this.vertex(i).weight;
            }
            return T;
        },
        MSTKruskal: function() {
            var edges = new (require('./Heap.js'))("weight"),
                UF = new (require('./UnionFind.js'))(this.vertices.length),
                T = new Graph(),
                i, e;
            for (i = 1; i < this.vertices.length ; i++) {
                this.vertex(i).edges.forEach(function(e) { edges.insert(e); });
            }
            while (!edges.isEmpty()) {
                e = edges.extract();
                if (!UF.connected(e.start, e.end)) {
                    T.addEdge(e.start, e.end, e.weight);
                    UF.union(e.start, e.end);
                }
            }
            return T;
        },
        shortestDijkstra: function(source) {
            // Move them into separate files, and have them mixin on Graph.
        },
        shortestBellmanFord: function(source) {
            
        },
        allShortestFordWarshall: function() {
            
        },
        allShortestJohnson: function() {
            
        }
    }

    return Graph;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
