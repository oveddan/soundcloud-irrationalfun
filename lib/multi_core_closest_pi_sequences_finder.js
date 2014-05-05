var async = require('async');
var fork = require('child_process').fork;

var ClosestSequences = require('./closest_sequences'),
  soundcloud = require('./soundcloud');

var multiCoreClosestsPiSequencesFinder = {
  findUsingMultipleCores : function(numberOfCores, highestDigitToRead, callback) {
    var parallelSequenceFinderProcesses = buildParallelSequenceFinderProcesses(numberOfCores, highestDigitToRead);

    async.parallel(
      parallelSequenceFinderProcesses,
      // callback with all data
      function(err, results){
        var closestSequences = soundcloud.buildClosestSequencesFinder();

        results.forEach(function(sequences){
          sequences.forEach(function(sequence){
            closestSequences.insert(sequence);
          });
        });

        var resultsAsHexGrid = closestSequences.all().map(function(sequence){
          return soundcloud.convertToHexGrid(sequence);
        });

        callback(null, resultsAsHexGrid);   
      }
    );
  }
};

exports = module.exports = multiCoreClosestsPiSequencesFinder;


// private helper methods
var buildParallelSequenceFinderProcesses = function(numberOfChildProcesses, highestDigitToRead){
  var processes = [];
 
  var startAndEndDigitsPerProcess = getStartAndEndDigitsPerProcess(numberOfChildProcesses, highestDigitToRead);

  // for each start and end digit, build a forked process that will callback with
  // its closest sequences
  startAndEndDigitsPerProcess.forEach(function(startAndEndDigit){
    var process = function(callback) {
      calculateDistanceInFork(startAndEndDigit.start, startAndEndDigit.end, callback); 
    }

    processes.push(process);
  });

  return processes;
}

var getStartAndEndDigitsPerProcess = function(numberOfChildProcesses, highestDigitToRead) {
  console.log(highestDigitToRead);

  var startAndEndDigits = [];

  var firstDigit = soundcloud.firstDigit;
  
  var digitsPerProcess = Math.ceil((highestDigitToRead - firstDigit) / numberOfChildProcesses);
  
  for(var childProcessNumber = 1; childProcessNumber <= numberOfChildProcesses; childProcessNumber ++){
    
    var startDigit = firstDigit + ((childProcessNumber - 1) * digitsPerProcess),
        lastDigit = startDigit + digitsPerProcess + soundcloud.sequenceLength;

    // correct to make sure we dont read past the last line
    if(lastDigit > highestDigitToRead)
      lastDigit = highestDigitToRead;

    startAndEndDigits.push({
      start : startDigit,
      end : lastDigit
    });
  }

  return startAndEndDigits;
}

var calculateDistanceInFork = function(firstDigitToRead, lastDigitToRead, callback){
  var forked = fork(__dirname + '/closest_pi_sequences_finder.js');

  forked.on('message', function(closestSequences){
    callback(null, closestSequences);
  });

  forked.send({
    firstStartDigit : firstDigitToRead,
    lastDigitToRead : lastDigitToRead
  });
};