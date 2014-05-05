var async = require('async');
var fork = require('child_process').fork;

var soundcloud = require('./soundcloud');

var multiCoreClosestsPiSequencesFinder = {
  findUsingMultipleCores : function(numberOfCores, numberOfDigits, callback) {
    var parallelSequenceFinderProcesses = buildParallelSequenceFinderProcesses(numberOfCores, numberOfDigits);

    async.parallel(
      parallelSequenceFinderProcesses,
      // callback with all data
      function(err, results){
        var closestSequencesFinder = soundcloud.buildClosestSequencesFinder();

        results.forEach(function(sequenceNodes){
          sequenceNodes.forEach(function(sequenceNode){
            closestSequencesFinder.insert(sequenceNode.sequence, sequenceNode.offset);
          });
        });

        callback(null, closestSequencesFinder.all());   
      }
    );
  }
};

exports = module.exports = multiCoreClosestsPiSequencesFinder;


// private helper methods
var buildParallelSequenceFinderProcesses = function(numberOfChildProcesses, numberOfDigits){
  var processes = [];
 
  var startAndEndDigitsPerProcess = getStartAndEndDigitsPerProcess(numberOfChildProcesses, numberOfDigits);

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

var getStartAndEndDigitsPerProcess = function(numberOfChildProcesses, numberOfDigits) {
  var startAndEndDigits = [];

  var firstDigit = soundcloud.firstDigit,
      highestDigitToRead = numberOfDigits + firstDigit;
  
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
  var forked = fork(__dirname + '/closest_sequences_in_pi_to_soundcloud.js');

  forked.on('message', function(closestSequencesFinder){
    callback(null, closestSequencesFinder);
  });

  forked.send({
    firstStartDigit : firstDigitToRead,
    lastDigitToRead : lastDigitToRead
  });
};