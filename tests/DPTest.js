var chai = require('chai'),
    expect = chai.expect,
    DP = require('../DP.js'),
    range = require('../utils/range.js');
chai.Assertion.includeStack = true;

describe("Dynamic programming code test", function() {
    it("on a simple 'step-by-step max' example", function() {
        var arr = [10, 5, 4, 3, 12, 6];
        var dp = new DP({
            subproblems: function(i) {
                expect(i).to.be.at.least(0);
                expect(i).to.be.below(arr.length);
                return (i == 0) ? [] : [i - 1];
            },
            compute: function(problem, sub) {
                expect(sub.length).to.at.most(1);
                expect(problem).to.equal(sub[0].problem + 1);
                return {
                    problem: problem,
                    value: (arr[problem] > sub[0].value) ? arr[problem] : sub[0].value,
                    previous: sub[0].problem
                };
            },
            initial: [{ problem: 0, value: arr[0] }]
        });
        expect(dp.solve(0).value).to.equal(10);
        expect(dp.solve(3).value).to.equal(10);
        expect(dp.solve(4).value).to.equal(12);
        expect(dp.solve(4).solution).to.deep.equal([0, 1, 2, 3, 4]);
    });
});
