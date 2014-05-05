var async = require('async');
var fork = require('child_process').fork;

var ClosestPiSequencesFinder = require('./lib/closest_pi_sequences_finder'),
  ClosestSequences = require('./lib/closest_sequences'),
  soundCloudConfig = require('./lib/soundcloud_config');

var numChildProcesses = 6;

var highestDigitsToRead = 10000000,
  firstDigit = 2;

var start = new Date();

var buildParellelProcesses = function(numberOfChildProcesses){
  var processes = [];

  var digitsPerProcess = Math.ceil((highestDigitsToRead - firstDigit) / numChildProcesses);

  for(var childProcessNumber = 1; childProcessNumber <= numberOfChildProcesses; childProcessNumber ++){
    
    var startDigit = firstDigit + ((childProcessNumber - 1) * digitsPerProcess),
        lastDigit = startDigit + digitsPerProcess + 84;

    // correct to make sure we dont read past the last line
    if(lastDigit > highestDigitsToRead)
      lastDigit = highestDigitsToRead;

    var process = buildChildProcess(startDigit, lastDigit);

    processes.push(process);
  }

  return processes;
}

var buildChildProcess = function(startDigit, lastDigit){
  return function(callback) {
    calculateDistanceInFork(startDigit, lastDigit, callback);
  }
}

var calculateDistanceInFork = function(firstDigitToRead, lastDigitToRead, callback){
  var forked = fork(__dirname + '/lib/closest_pi_sequences_finder.js');

  forked.on('message', function(message){
    callback(null, message);
  });

  forked.send({
    firstStartDigit : firstDigitToRead,
    lastDigitToRead : lastDigitToRead
  });
};

async.parallel(
  buildParellelProcesses(6),
  // callback with all data
  function(err, results){
    var closestSequences = new ClosestSequences(soundCloudConfig.sequence, soundCloudConfig.numberOfResults);

    var timeElapsed = new Date() - start;

    results.forEach(function(sequences){
      sequences.forEach(function(sequence){
        closestSequences.insert(sequence);
      });
    });
  
    console.log('for num digits ' + highestDigitsToRead);
    console.log('time elapsed ' + timeElapsed + 'ms');
    console.log('results:' + closestSequences.all());    
  }
);