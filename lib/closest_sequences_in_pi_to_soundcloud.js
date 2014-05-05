var fs = require('fs'),
    Transform = require('stream').Transform;

var soundcloud = require('./soundcloud');

exports = module.exports = ClosestSequencesInPiToSoundcloud;

function ClosestSequencesInPiToSoundcloud(firstStartDigit, lastDigitToRead) {
  this.currentOffset = firstStartDigit - soundcloud.firstDigit;
  this.readStream = fs.createReadStream('pi-billion.txt', {
    encoding: 'utf-8',
    autoClose: true,
    start: firstStartDigit,
    end: lastDigitToRead
  });
};

ClosestSequencesInPiToSoundcloud.prototype.findClosestSequences = function(callback) {
  var closestSequencesFinder = soundcloud.buildClosestSequencesFinder();
    sequence = [],
    sequenceLength = soundcloud.sequenceLength,
    self = this;

    var sequenceStreamer = new Transform();

    // this takes a chunk, breaks it into 84 characer sequences,
    // and gives it to the sequence finder.
    sequenceStreamer._transform = function(chunk, encoding, next) {
      var result = [];
      var dataString = chunk.toString();

      // read all characters 1 by 1 from the chunk
      for(var i = 0; i < dataString.length; i++){
        sequence.push(parseInt(dataString[i]));
        self.currentOffset++;

        // if sequence has not yet reached the desired sequence length,
        // do nothing and go to the next iteration

        if(sequence.length > sequenceLength) {        
          // if sequence length has grown bigger than the desired sequence length
          // remove first element, and then insert sequence into closest sequences
          sequence.shift();
          closestSequencesFinder.insert(sequence, self.currentOffset);
        }
        else if(sequence.length == sequenceLength)
          // insert sequence into closest sequences
          closestSequencesFinder.insert(sequence, self.currentOffset);  
      }

      // request next set of characters from the stream
      next();
    };

    // when done processing all sequences, callback with result
    sequenceStreamer._flush = function(){
      callback(null, closestSequencesFinder.results());
    }

    this.readStream.pipe(sequenceStreamer);
}

// if this is run in a child process
if(process) {
  process.on('message', function(m){
    // when this receives a message, it builds the sequence finder,
    // and finds the results
    var finder = new ClosestSequencesInPiToSoundcloud(m.firstStartDigit, m.lastDigitToRead);
    finder.findClosestSequences(function(e, sequences){
      process.send(sequences);
      process.disconnect();
    });
  });
}


