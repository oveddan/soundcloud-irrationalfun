var async = require('async');
var fork = require('child_process').fork;

var ClosestPiSequencesFinder = require('./lib/closest_pi_sequences_finder'),
  ClosestSequences = require('./lib/closest_sequences'),
  soundcloud = require('./lib/soundcloud');

var highestDigitsToRead = 1000000000,
  firstDigit = 2;

var start = new Date();

var getStartAndEndDigits = function(numberOfChildProcesses) {
  var startAndEndDigits = [];
  
  var digitsPerProcess = Math.ceil((highestDigitsToRead - firstDigit) / numberOfChildProcesses);

  for(var childProcessNumber = 1; childProcessNumber <= numberOfChildProcesses; childProcessNumber ++){
    var startDigit = firstDigit + ((childProcessNumber - 1) * digitsPerProcess),
        lastDigit = startDigit + digitsPerProcess + 84;

    // correct to make sure we dont read past the last line
    if(lastDigit > highestDigitsToRead)
      lastDigit = highestDigitsToRead;

    startAndEndDigits.push({
      start : startDigit,
      end : lastDigit
    });
  }

  return startAndEndDigits;
}

var buildParellelProcesses = function(numberOfChildProcesses){
  var processes = [];

  var startAndEndDigits = getStartAndEndDigits(numberOfChildProcesses);

  startAndEndDigits.forEach(function(startAndEndDigit){
    var process = buildChildProcess(startAndEndDigit.start, startAndEndDigit.end);

    processes.push(process);
  });

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
  buildParellelProcesses(8),
  // callback with all data
  function(err, results){
    var closestSequences = soundcloud.buildClosestSequencesFinder();

    var timeElapsed = new Date() - start;

    results.forEach(function(sequences){
      sequences.forEach(function(sequence){
        closestSequences.insert(sequence);
      });
    });

    var resultsAsHexGrid = closestSequences.all().map(function(sequence){
      return soundcloud.convertToHexGrid(sequence);
    });
  
    console.log('for num digits ' + highestDigitsToRead);
    console.log('time elapsed ' + timeElapsed + 'ms');
    console.log('results:');
    console.log(resultsAsHexGrid);    
  }
);