var chai = require('chai'),
    expect = chai.expect,
    Graph = require('../Graph/Graph.js');
chai.Assertion.includeStack = true;

describe("Graphs", function() {
    var t;
    beforeEach(function(){
        g = new Graph({directed: true});
    });
    it("runs Dijkstra's", function() {
        g.addEdge(1, 2, 1).addEdge(1, 4, 3).addEdge(2, 4, 1);
        var A = g.shortestDijkstra(1);
        expect(A[1]).to.equal(0);
        expect(A[2]).to.equal(1);
        expect(A[4]).to.equal(2);
    });
    it("runs Bellman-Ford", function() {
        g.addEdge(1, 2, 1).addEdge(1, 4, 3).addEdge(2, 4, 1);
        var A = g.shortestBellmanFord(1);
        expect(A[1]).to.equal(0);
        expect(A[2]).to.equal(1);
        expect(A[4]).to.equal(2);
    });
    it("and they agree on minimum path lengths", function() {
        var e = 40, v = 10;
        for (var i = 0; i < e; i++) {
            var x = Math.floor(Math.random() * v) + 1,
                y = Math.floor(Math.random() * v) + 1,
                w = Math.floor(Math.random() * 6);
            if (x !== y && !g.hasEdge(x, y)) {
                g.addEdge(x, y, w);
                console.log(x, y, w);
            }
        }
        var C = g.allShortestFordWarshall();
        var D = g.allShortestJohnson();
        // console.log(C);
        // console.log(D);
        for (var i = 1; i < g.vertices.length; i++) {
            var A = g.shortestDijkstra(i),
                B = g.shortestBellmanFord(i);
            expect(A.length).to.equal(B.length);
            for (var j = 1; j < A.length; j++) {
                if (A[j] != null) {
                    expect(A[j]).to.be.equal(B[j]);
                    expect(A[j]).to.be.equal(C[i][j]);
                }
            }
        }
    });
    it("trying to break Bellman Ford", function() {
        var e = 20, v = 10, N = 1000, c = 0, g, A, B, C;
        while (c++ < N) {
            A = [];
            g = new Graph({ directed: true });
            for (var i = 0; i < e; i++) {
                var x = Math.floor(Math.random() * v) + 1,
                    y = Math.floor(Math.random() * v) + 1,
                    w = Math.floor(Math.random() * 2);
                if (x !== y && !g.hasEdge(x, y)) {
                    g.addEdge(x, y, w);
                    A.push([x, y, w]);
                }
            }
            console.log(A);
            B = g.shortestBellmanFord(1);
            C = g.shortestDijkstra(1);
            // if (B == null) {
            //     console.log("Broke it!");
            //     console.log(A);
            //     break;
            // }
        }
    });
});
