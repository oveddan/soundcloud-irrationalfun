var fs = require('fs');

var soundcloud = require('./soundcloud');

exports = module.exports = ClosestPiSequencesFinder;

function ClosestPiSequencesFinder(firstStartDigit, lastDigitToRead) {
  this.readStream = fs.createReadStream('pi-billion.txt', {
    encoding: 'utf-8',
    autoClose: true,
    start: firstStartDigit,
    end: lastDigitToRead
  });
};

var Transform = require('stream').Transform;

ClosestPiSequencesFinder.prototype.findClosestSequences = function(callback) {
  var closestSequences = soundcloud.buildClosestSequencesFinder();
    sequence = [],
    sequenceLength = soundcloud.sequenceLength;

    var sequenceStreamer = new Transform();

    sequenceStreamer._transform = function(chunk, encoding, next) {
      var result = [];
      var dataString = chunk.toString();

      // read all characters 1 by 1 from the chunk
      for(var i = 0; i < dataString.length; i++){
        sequence.push(parseInt(dataString[i]));

        // if sequence has not yet reached the desired sequence length,
        // do nothing and go to the next iteration

        if(sequence.length > sequenceLength) {        
          // if sequence lenght has grown bigger than the number of sequences
          // remove first element, and then insert sequence into closest sequences
          sequence.shift();
          closestSequences.insert(sequence);
        }
        else if(sequence.length == sequenceLength)
          // insert sequence into closest sequences
          closestSequences.insert(sequence);
      }

      // request next set of characters from the stream
      next();
    };

    // when done processing all sequences, callback with result
    sequenceStreamer._flush = function(){
      callback(null, closestSequences.all());
    }

    this.readStream.pipe(sequenceStreamer);
}

var start = new Date();

if(process) {
  process.on('message', function(m){
    
    var finder = new ClosestPiSequencesFinder(m.firstStartDigit, m.lastDigitToRead);
    finder.findClosestSequences(function(e, sequences){
      process.send(sequences);
      process.disconnect();
    });
  });
}


