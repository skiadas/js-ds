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
        hasEdge: function(i, j) {
            if (!this.vertices[i]) return false;
            var edges = this.vertices[i].edges;
            for (var i = 0; i < edges.length; i++) {
                if (edges[i].end === j) return edges[i];
            }
            return false;
        },
        addEdge: function(i, j, weight) {
            this.addVertex(i);
            this.addVertex(j);
            if (weight == null) weight = 1;
            this.outgoing(i).push({ start: i, end: j, weight: weight });
            if (!this.options.directed)
                this.outgoing(j).push({ start: j, end: i, weight: weight });
            return this;
        },
        reverse: function() {
            var g = new Graph({ directed: this.options.directed }),
                vertices = this.vertices,
                i, edges;
            for (i = 1; i < vertices.length; i++) {
                if (vertices[i]) {
                    edges = vertices[i].edges;
                    edges.forEach(function(edge) {
                        g.addEdge(edge.end, edge.start, edge.weight);
                    });
                }
            }
            return g;
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
            var vHeap = new (require('../Heap.js'))("weight");
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
            var edges = new (require('../Heap.js'))("weight"),
                UF = new (require('../UnionFind.js'))(this.vertices.length),
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
            var vertices = this.vertices,
                Xs = new Array(vertices.length), // Vertices as stored in the heap
                heap = new (require('../Heap.js'))(function(a, b) { return a.distance < b.distance }, true),
                i, d, curr, edges, newVal, endpoint;
            for (i = Xs.length; i-- > 1;) {
                if (vertices[i]) {
                    vertices[i].distance = (i === source) ?  0 : Infinity;
                    // Xs[i] = 
                    heap.insert(vertices[i]);
                }
            }
            while (!heap.isEmpty()) {
                curr = heap.extract();
                edges = curr.edges;
                for (i = edges.length; i--;) {
                    newVal = curr.distance + edges[i].weight;
                    endpoint = vertices[edges[i].end];
                    if (newVal < endpoint.distance) {
                        heap.deleteObj(endpoint);
                        endpoint.distance = newVal;
                        heap.insert(endpoint);
                    }
                }
            }
            return this.vertices.map(function(v) { return (v != null) ? v.distance : null; });
        },
        shortestBellmanFord: function(source) {
            var grev = this.reverse(),
                A = [], i, j, extraA,
                vertices = this.vertices,
                BFstep = function(B) {
                    var ret = [], edges, i;
                    for (i = 1; i < vertices.length; i++) {
                        ret[i] = B[i];
                        if (grev.vertices[i]) {
                            grev.vertices[i].edges.forEach(function(edge) {
                                ret[i] = Math.min(B[edge.end] + edge.weight, ret[i]);
                            });
                        }
                    }
                    return ret;
                }
            for (i = 1; i < vertices.length; i++) { A[i] = Infinity; }
            A[source] = 0;
            // N-1 iterations
            for (i = 1; i < vertices.length - 1; i++) { A = BFstep(A); }
            extraA = BFstep(A);
            for (i = 1; i <= vertices.length; i++) {
                // Negative cycle case. Perhaps should return the cycle?
                if (extraA[i] != A[i]) return null;
            }
            return A;
        },
        allShortestFloydWarshall: function() {
            var A = [], i, j, k,
                vertices = this.vertices,
                n = vertices.length,
                FWstep = function(B, k) {
                    var ret = [], i, j;
                    for (i = 1; i < n; i++) {
                        ret[i] = [];
                        for (j = 1; j < n; j++) {
                            ret[i][j] = Math.min(B[i][j], B[i][k] + B[k][j]);
                        }
                    }
                    return ret;
                };
            // Initialize
            for (i = 1; i < n; i++) {
                A[i] = [];
                for (j = 1; j < n; j++) { A[i][j] = Infinity; }
                A[i][i] = 0;
                if (vertices[i] != null) {
                    vertices[i].edges.forEach(function(edge) {
                        if (edge.start != i) throw "Error!";
                        A[edge.start][edge.end] = edge.weight;
                    });
                }
            }
            // Iterate
            for (k = 1; k < n; k++) { A = FWstep(A, k); }
            for (i = 1; i < n; i++) {
                // Negative cycle case
                if (A[i][i] < 0) { return null; }
            }
            return A;
        },
        allShortestFloydWarshallVariant: function() {
            // What does it compute??
            var A = [], i, j, k,
                vertices = this.vertices,
                n = vertices.length,
                FWstep = function(B, k) {
                    var ret = [], i, j;
                    for (i = 1; i < n; i++) {
                        ret[i] = [];
                        for (j = 1; j < n; j++) {
                            ret[i][j] = B[i][j] + B[i][k] * B[k][j];
                        }
                    }
                    return ret;
                };
            // Initialize
            for (i = 1; i < n; i++) {
                A[i] = [];
                for (j = 1; j < n; j++) { A[i][j] = 0; }
                if (vertices[i] != null) {
                    vertices[i].edges.forEach(function(edge) {
                        if (edge.start != i) throw "Error!";
                        A[edge.start][edge.end] = 1;
                    });
                }
            }
            console.log(A);
            // Iterate
            for (k = 1; k < n; k++) { A = FWstep(A, k); }
            return A;
        },
        allShortestJohnson: function() {
            var vertices = this.vertices,
                N = vertices.length,
                extraV = N, i, j, BFStep, A;
            for (i = 1; i < N; i++) { this.addEdge(extraV, i, 0); }
            BFStep = this.shortestBellmanFord(extraV);
            if (BFStep == null) {
                console.log("Bellman Ford step found negative cycle.");
                return null;
            }
            // console.log(BFStep);
            vertices.pop(); // Remove the extra vertex
            for (i = 1; i < N; i++) {
                if (vertices[i]) {
                    vertices[i].edges.forEach(function(edge) {
                        edge.weight = edge.weight + BFStep[edge.start] - BFStep[edge.end];
                        if (edge.weight < 0) { throw "Still negative edge costs!"; }
                    });
                }
            }
            A = [];
            for (i = 1; i < N; i++) {
                A[i] = this.shortestDijkstra(i);
                for (j = 1; j < N; j++) {
                    A[i][j] = A[i][j] - BFStep[i] + BFStep[j];
                }
            }
            return A;
        }
    }

    return Graph;
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
