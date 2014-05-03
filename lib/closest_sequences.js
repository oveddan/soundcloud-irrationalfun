var MaxHeap = require('./max_heap'),
  VisualCloseness = require('./visual_closeness');

exports = module.exports = ClosestSequences;

function ClosestSequences(originalSequence, maxSequences){
  this.visualCloseness = new VisualCloseness(originalSequence);
  this.maxHeap = new MaxHeap(maxSequences + 1);
  this.maxSequences = maxSequences;
  this.numSequences = 0;
};

ClosestSequences.prototype.insert = function(sequence){
  var differenceScore = this.visualCloseness.differenceScore(sequence);

  // if not at capacity yet, just insert new node
  if(this.maxHeap.size() < this.maxSequences) {
    
    var node = {
      sequence : sequence.slice(),
      differenceScore : differenceScore
    };

    this.maxHeap.insert(node);

  // if at capacity, but new item is less than the max of the current items
  // insert it
  } else if(differenceScore < this.maxHeap.max().differenceScore) {

    var node = {
      sequence : sequence.slice(),
      differenceScore : differenceScore
    };

    this.maxHeap.insert(node);

    var removed = this.maxHeap.delMax();
  }
};

ClosestSequences.prototype.all = function() {
  return this.maxHeap.all().map(function(node){
    return node.sequence;
  });
};