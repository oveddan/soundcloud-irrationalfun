var VisualCloseness = require('../visual_closeness');

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

var visualCloseness = new VisualCloseness(originalSequence);

var start = new Date();
for(var j = 0; j < 10; j++) {
  for(var i = 0, max = sequences.length; i < max; i++) {
    visualCloseness.differenceScore(sequences[i]);
  }
  // if(j % 10 == 0)
  //   console.log(j);
}
var end = new Date();

var diff = end - start;

console.log(diff);