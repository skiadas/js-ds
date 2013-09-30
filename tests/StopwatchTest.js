var chai = require('chai'),
    expect = chai.expect,
    Stopwatch = require('../utils/stopwatch.js'),
    range = require('../utils/range.js');

chai.Assertion.includeStack = true;

describe("Stopwatch objects", function() {
    it("hold a list of time intervals", function() {
        var sw = new Stopwatch(), N = 100;
        range(N).each(function() { sw.lap(); });
        expect(sw.laps.length).to.equal(N);
        sw.reset();
        expect(sw.laps.length).to.equal(N);
        sw.clear();
        expect(sw.laps.length).to.equal(0);
    });
});
