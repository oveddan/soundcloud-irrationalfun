var abs = Math.abs;

exports = module.exports = VisualDifferenceComparer;

function VisualDifferenceComparer(originalSequence){
  this.originalSequence = originalSequence;
}

VisualDifferenceComparer.prototype.differenceScore = function(toCompareTo, maxScore) {
  var score = 0;

  if (maxScore == null)
    return calculateScore(this.originalSequence, toCompareTo);
  else
    return calculateScoreWithMax(this.originalSequence, toCompareTo, maxScore);

  return score;
}

// privat helper functions
var calculateScore = function(originalSequence, toCompareTo){
  var score = 0;

  for(var i = 0, max = originalSequence.length; i < max; i++) {
    score += abs(originalSequence[i] - toCompareTo[i]);
  };

  return score;
},
calculateScoreWithMax = function(originalSequence, toCompareTo, maxScore){
  var score = 0;
  // when there is a max score, to save time, stop calculating
  // when reach the max
  for(var i = 0, max = originalSequence.length; i < max; i++) {
    score += abs(originalSequence[i] - toCompareTo[i]);
  
    // stop calculating once the max score is reached
    if(score >= maxScore) {
      score = Number.POSITIVE_INFINITY;
      break;
    }
  }

  return score;
}