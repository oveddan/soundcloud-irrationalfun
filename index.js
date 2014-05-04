var async = require('async');

var ClosestPiSequencesFinder = require('./lib/closest_pi_sequences_finder');

var numChildProcesses = 2;

var highestDigitsToRead = 10000000,
  firstDigit = 2;


var totalStartIndexes = highestDigitsToRead - 84 - 2;
var firstStartIndex = 2,
    secondStartIndex = (totalStartIndexes / 2) + 84;


var start = new Date();

async.parallel([
  function(callback){
    var finder = new ClosestPiSequencesFinder(2, secondStartIndex - 1);
    finder.findClosestSequences(function(err, data){
      callback(null, data);
    });
  },
  function(callback){
    var finder = new ClosestPiSequencesFinder(secondStartIndex, highestDigitsToRead);
    finder.findClosestSequences(function(err, data){
      callback(null, data);
    });
  },
],
// callback with all data
function(err, results){
  var timeElapsed = new Date() - start;
  console.log('for num digits ' + highestDigitsToRead);
  console.log('time elapsed ' + timeElapsed + 'ms');
  console.log('results:');
  results.forEach(function(result){
    console.log(result);
  })
});