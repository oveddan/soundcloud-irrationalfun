var chai = require('chai'),
  expect = chai.expect;

var ClosestSequencesFinder = require('../lib/closest_sequences_finder');

var sequenceNodeComparer = function(a, b){
  if(a.differenceScore < b.differenceScore) 
    return -1;
  else
    return 1;
}

describe('ClosestSequencesFinder', function(){
  describe('insert(sequence)', function(){
    describe('if the maximum number of sequences has not been reached', function(){
      beforeEach(function(){
        this.closestSequencesFinder = new ClosestSequencesFinder([0, 0, 0], 3);
      });
      it('gets added to the closest sequences', function(){
        this.closestSequencesFinder.insert([1, 1, 1], 3);
        this.closestSequencesFinder.insert([2, 2, 2], 5);
        this.closestSequencesFinder.insert([3, 3, 3], 7);

        expect(this.closestSequencesFinder.results()).to.eql([
          {
            sequence : [1, 1, 1],
            differenceScore : 3,
            offset : 3
          },
          {
            sequence : [2, 2, 2],
            differenceScore : 6,
            offset : 5
          },
          {
            sequence : [3, 3, 3],
            differenceScore : 9,
            offset : 7
          }
        ]);
      });
    });
    describe('if the maximum number of sequences has been reached', function(){
      beforeEach(function(){
        this.closestSequencesFinder = new ClosestSequencesFinder([0, 0, 0], 3);
        this.closestSequencesFinder.insert([6, 6, 6], 5);
        this.closestSequencesFinder.insert([3, 3, 3], 2);
        this.closestSequencesFinder.insert([8, 8, 8], 27);
      });
      describe('if the sequence\'s difference score is greater than or equal to the difference score of the existing sequences', function(){
        it('does not get added to the closest sequences', function(){
          this.closestSequencesFinder.insert([7, 8, 9], 30);
          this.closestSequencesFinder.insert([9, 9, 9], 10);

          expect(this.closestSequencesFinder.results()).to.eql([
            {
              sequence : [3, 3, 3],
              differenceScore : 9,
              offset : 2
            },
            {
              sequence : [6, 6, 6],
              differenceScore : 18,
              offset : 5
            },
            {
              sequence : [8, 8, 8],
              differenceScore : 24,
              offset : 27
            }
          ]);
        });
      });
      describe('if the sequence\'s difference score is less than the difference scores of any of the existing sequences', function(){
        it('gets added to the closest sequences and removes the element with the highest difference score', function(){
          this.closestSequencesFinder.insert([1, 1, 1], 900);
          this.closestSequencesFinder.insert([7, 7, 7], 360);

          expect(this.closestSequencesFinder.results()).to.eql([
            {
              sequence : [1, 1, 1],
              differenceScore : 3,
              offset : 900
            },
            {
              sequence : [3, 3, 3],
              differenceScore : 9,
              offset : 2
            },
            {
              sequence : [6, 6, 6],
              differenceScore : 18,
              offset : 5
            }
          ]);
        });
      });
    });
  });
});