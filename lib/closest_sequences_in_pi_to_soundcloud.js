var fs = require('fs'),
    Transform = require('stream').Transform;

var soundcloud = require('./soundcloud');

exports = module.exports = ClosestSequencesInPiToSoundcloud;

function ClosestSequencesInPiToSoundcloud(firstStartDigit, lastDigitToRead) {
  this.currentOffset = firstStartDigit - 2;
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

    sequenceStreamer._transform = function(chunk, encoding, next) {
      var result = [];
      var dataString = chunk.toString();
      var offset;

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
      callback(null, closestSequencesFinder.all());
    }

    this.readStream.pipe(sequenceStreamer);
}

var start = new Date();

if(process) {
  process.on('message', function(m){

    var finder = new ClosestSequencesInPiToSoundcloud(m.firstStartDigit, m.lastDigitToRead);
    finder.findClosestSequences(function(e, sequences){
      process.send(sequences);
      process.disconnect();
    });
  });
}


