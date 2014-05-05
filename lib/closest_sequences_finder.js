var MaxHeap = require('./max_heap'),
  VisualDifferenceComparer = require('./visual_difference_comparer');

exports = module.exports = ClosestSequencesFinder;

function ClosestSequencesFinder(originalSequence, maxSequences){
  this.comparer = new VisualDifferenceComparer(originalSequence);
  this.maxHeap = new MaxHeap(maxSequences + 1);
  this.maxSequences = maxSequences;
  this.numSequences = 0;
};

ClosestSequencesFinder.prototype.insert = function(sequence, offset){
  var differenceScore = this.comparer.differenceScore(sequence);

  // if not at capacity yet, just insert new node
  if(this.maxHeap.size() < this.maxSequences) {
    var node = buildNode(sequence, differenceScore, offset);

    this.maxHeap.insert(node);

  // if at capacity, but new item is less than the max of the current items
  // insert it
  } else if(differenceScore < this.maxHeap.max().differenceScore) {

    var node = buildNode(sequence, differenceScore, offset);

    this.maxHeap.insert(node);

    var removed = this.maxHeap.delMax();
  }
};

ClosestSequencesFinder.prototype.results = function(){
  return sortSequenceNodes(this.maxHeap.all());
};

// private helper methods
var buildNode = function(sequence, differenceScore, offset) {
  return {
    sequence : sequence.slice(),
    differenceScore : differenceScore,
    offset : offset
  };
};

var sortSequenceNodes = function(sequenceNodes){
  return sequenceNodes.sort(function(a, b){
    if(a.differenceScore < b.differenceScore)
      return -1;
    else
      return 1;
  });
};