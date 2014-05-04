var abs = Math.abs;

exports = module.exports = VisualDifferenceComparer;

function VisualDifferenceComparer(originalSequence){
  this.originalSequence = originalSequence;
}

VisualDifferenceComparer.prototype.differenceScore = function(toCompareTo) {
  var score = 0;
  for(var i = 0, max = this.originalSequence.length; i < max; i++) {
    score += abs(this.originalSequence[i] - toCompareTo[i]);
  }
  return score;
}