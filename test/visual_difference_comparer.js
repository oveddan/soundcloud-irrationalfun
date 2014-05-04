var chai = require('chai'),
  expect = chai.expect;

var VisualDifferenceComparer = require('../lib/visual_difference_comparer');

describe('VisualDifferenceComparer', function(){
  describe('differenceScore(sequence)', function(){
    it('calculates the sum of the differences of each element from the origin sequence', function(){
      var originalSequence = [0, 3, 2, 9, 5, 4, 0, 8, 3, 6, 2];
      var toCompareTo =      [1, 3, 0, 7, 6, 4, 4, 5, 2, 8, 6];

      var comparer = new VisualDifferenceComparer(originalSequence);

      var differenceScore = comparer.differenceScore(toCompareTo);

      var abs = Math.abs;

      var expectedResult = (1 - 0) + (3 - 3) + abs(0 - 2) + abs(7 - 9) + abs(6 - 5) + 
        (4 - 4) + (4 - 0) + abs(5 - 8) + abs(2 - 3) + (8 - 6) + (6 - 2);

      expect(differenceScore).to.eq(expectedResult);
    });
  });
});