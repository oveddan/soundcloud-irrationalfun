var chai = require('chai'),
  expect = chai.expect;

var VisualDifferenceComparer = require('../lib/visual_difference_comparer');

describe('VisualDifferenceComparer(sequenceToCompareTo)', function(){
  describe('differenceScore(sequence, maxScore)', function(){
    it('calculates the sum of the differences of each element from the origin sequence', function(){
      var sequenceToCompareTo = [0, 3, 2, 9, 5, 4, 0, 8, 3, 6, 2],
          toCompareTo         = [1, 3, 0, 7, 6, 4, 4, 5, 2, 8, 6],

          comparer = new VisualDifferenceComparer(sequenceToCompareTo);

      var differenceScore = comparer.differenceScore(toCompareTo, null);

      var abs = Math.abs;

      var expectedResult = (1 - 0) + (3 - 3) + abs(0 - 2) + abs(7 - 9) + abs(6 - 5) + 
        (4 - 4) + (4 - 0) + abs(5 - 8) + abs(2 - 3) + (8 - 6) + (6 - 2);

      expect(differenceScore).to.eq(expectedResult);
    });
    describe('stops calculating when it reaches the max score, and returns infinity', function(){
      var originalSequence = [1, 1, 1];
          toCompareTo =      [1, 3, 1];

          comparer = new VisualDifferenceComparer(originalSequence);

      var differenceScore = comparer.differenceScore(toCompareTo, 2);

      expect(differenceScore).to.eq(Number.POSITIVE_INFINITY);
    });
  });
});