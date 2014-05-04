var VisualDifferenceComparer = require('../lib/visual_difference_comparer');

var sequences = [];

var generateRandomSequence = function(){
  var sequence = [];
  for(var i = 0; i < 84; i++){
    sequence.push(Math.floor((Math.random() * 10)));
  }
  return sequence;
};

var originalSequence = generateRandomSequence();

// 1 million records
for(var i = 0; i < 1000000; i++) {
  sequences.push(generateRandomSequence());
}

var comparer = new VisualDifferenceComparer(originalSequence);

var start = new Date();
for(var j = 0; j < 10; j++) {
  for(var i = 0, max = sequences.length; i < max; i++) {
    comparer.differenceScore(sequences[i]);
  }
}
var end = new Date();

var diff = end - start;

console.log(diff);