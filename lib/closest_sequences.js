require('./max_heap')

exports = module.exports = ClosestSequences;

function ClosestSequences(originalSequence, maxSequences){
  this.visualCloseness = new VisualCloseness(originalSequence);
  this.maxHeap = new MaxHeap(maxSequences);
};