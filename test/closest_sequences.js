var chai = require('chai'),
  expect = chai.expect;

var ClosestSequences = require('../lib/closest_sequences');

describe('ClosestSequences', function(){
  describe('insert(sequence)', function(){
    describe('if the maximum number of sequences has not been reached', function(){
      before(function(){
        this.closestSequences = new ClosestSequences([0, 0, 0], 3);
      });
      it('gets added to the closest sequences', function(){
        this.closestSequences.insert([1, 1, 1]);
        this.closestSequences.insert([2, 2, 2]);
        this.closestSequences.insert([3, 3, 3]);

        expect(this.closestSequences.all()).to eq([
          [1, 1, 1],
          [2, 2, 2],
          [3, 3, 3]
        ]);
      });
    });
    describe('if the maximum number of sequences has been reached', function(){
      before(function(){
        this.closestSequences = new ClosestSequences([0, 0, 0], 3);
        this.closestSequences.insert([3, 3, 3]);
        this.closestSequences.insert([6, 6, 6]);
        this.closestSequences.insert([8, 8, 8]);
      });
      describe('if the sequence\'s difference score is greater than or equal to the difference score of the existing sequences', function(){
        it('does not get added to the closest sequences', function(){
          this.closestSequences.insert([9, 9, 9]);
          this.closestSequences.insert([9, 8, 7]);

          expect(this.closestSequences.all()).to eq([
            [3, 3, 3],
            [6, 6, 6],
            [8, 8, 8]
          ]);
        });
      });
      describe('if the last removed sequence\'s difference score is greater than the difference score of the sequence', function(){
        it('gets added to the closest sequences', function(){

        });
        describe('if the number of closest sequences is greater than the max number of close sequences', function(){
          it('removes the least close sequence (with the highest cloness score)', function(){

          });
          it('sets the removed sequence\'s difference score to the difference score of the removed sequence', function(){

          });
        });
      });
    });
  });
});