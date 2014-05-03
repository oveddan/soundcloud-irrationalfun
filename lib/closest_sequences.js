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
  var node = {
    sequence : sequence,
    differenceScore : differenceScore
  };

  console.log('\nadding');
  console.log(node);

  this.maxHeap.insert(node);

  console.log(this.all());

  if(this.maxHeap.size() > this.maxSequences) {
    console.log('removing');
    console.log(this.maxHeap.delMax());
    console.log(this.all());
  }
};

ClosestSequences.prototype.all = function() {
  return this.maxHeap.all().map(function(node){
    return node.sequence;
  });
};