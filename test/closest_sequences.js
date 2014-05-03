var chai = require('chai'),
  expect = chai.expect;

var ClosestSequences = require('../lib/closest_sequences');

describe('ClosestSequences', function(){
  describe('insert(sequence)', function(){
    describe('if the maximum number of sequences has not been reached', function(){
      beforeEach(function(){
        this.closestSequences = new ClosestSequences([0, 0, 0], 3);
      });
      it('gets added to the closest sequences', function(){
        this.closestSequences.insert([1, 1, 1]);
        this.closestSequences.insert([2, 2, 2]);
        this.closestSequences.insert([3, 3, 3]);

        expect(this.closestSequences.all().sort()).to.eql([
          [1, 1, 1],
          [2, 2, 2],
          [3, 3, 3]
        ]);
      });
    });
    describe('if the maximum number of sequences has been reached', function(){
      beforeEach(function(){
        this.closestSequences = new ClosestSequences([0, 0, 0], 3);
        this.closestSequences.insert([6, 6, 6]);
        this.closestSequences.insert([3, 3, 3]);
        this.closestSequences.insert([8, 8, 8]);
      });
      describe('if the sequence\'s difference score is greater than or equal to the difference score of the existing sequences', function(){
        it('does not get added to the closest sequences', function(){
          this.closestSequences.insert([7, 8, 9]);
          this.closestSequences.insert([9, 9, 9]);

          expect(this.closestSequences.all().sort()).to.eql([
            [3, 3, 3],
            [6, 6, 6],
            [8, 8, 8]
          ]);
        });
      });
      describe('if the sequence\'s difference score is less than the difference scores of any of the existing sequences', function(){
        it('gets added to the closest sequences', function(){
          this.closestSequences.insert([1, 1, 1]);

          expect(this.closestSequences.all().sort()).to.eql([
            [1, 1, 1],
            [3, 3, 3],
            [6, 6, 6]
          ]);
        });
        it('removes the element with the highest difference score', function(){
          this.closestSequences.insert([1, 1, 1]);
          this.closestSequences.insert([7, 7, 7]);

          expect(this.closestSequences.all().sort()).to.eql([
            [1, 1, 1],
            [3, 3, 3],
            [6, 6, 6]
          ]);      
        });
      });
    });
  });
});