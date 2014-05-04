var MaxHeap = require('./max_heap'),
  VisualDifferenceComparer = require('./visual_difference_comparer');

exports = module.exports = ClosestSequences;

function ClosestSequences(originalSequence, maxSequences){
  this.comparer = new VisualDifferenceComparer(originalSequence);
  this.maxHeap = new MaxHeap(maxSequences + 1);
  this.maxDifference = null;
  this.maxSequences = maxSequences;
  this.numSequences = 0;
};

ClosestSequences.prototype.insert = function(sequence){
  var differenceScore = this.comparer.differenceScore(sequence, this.maxDifference);

  // if not at capacity yet, just insert new node
  if(this.maxHeap.size() < this.maxSequences) {
    var node = buildNode(sequence, differenceScore);

    this.maxHeap.insert(node);

  // if at capacity, but new item is less than the max of the current items
  // insert it
  } else if(differenceScore < this.maxHeap.max().differenceScore) {

    var node = buildNode(sequence, differenceScore);

    this.maxHeap.insert(node);

    removed = this.maxHeap.delMax();
    maxDifference = removed.differenceScore;
  }
};

ClosestSequences.prototype.all = function() {
  return this.maxHeap.all().map(function(node){
    return node.sequence;
  });
};

var buildNode = function(sequence, differenceScore) {
  return {
    sequence : sequence.slice(),
    differenceScore : differenceScore
  };
}