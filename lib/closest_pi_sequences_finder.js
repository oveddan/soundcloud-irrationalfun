var fs = require('fs');

var ClosestSequences = require('./closest_sequences'),
  soundCloudConfig = require('./soundcloud_config');

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
  var closestSequences = new ClosestSequences(soundCloudConfig.sequence, soundCloudConfig.numberOfResults),
    sequence = [],
    sequenceLength = soundCloudConfig.sequence.length;

    var sequenceStreamer = new Transform();

    sequenceStreamer._transform = function(chunk, encoding, next) {
      var result = [];
      var dataString = chunk.toString();

      for(var i = 0; i < dataString.length; i++){
        sequence.push(parseInt(dataString[i]));

        if(sequence.length > sequenceLength) {
          sequence.shift();
          closestSequences.insert(sequence);
        }
        else if(sequence.length == sequenceLength)
          closestSequences.insert(sequence);
      }

      next();
    };

    // when done processing all sequences, convert into a
    // grid and output it
    sequenceStreamer._flush = function(){
      // var hexGrid = closestSequences.all().map(function(sequence){
      //   var result = [];
      //   var index = 0;

      //   // turn into 14 x 6 hex grid
      //   for(var i = 0; i < 6; i++) {
      //     result.push([]);
      //     for(var j = 0; j < 14; j++) {
      //       result[i].push(sequence[index]);
      //       index++;
      //     }
      //   }

      //   return result;
      // });

      // var totalTime = new Date() - start;

      callback(null, closestSequences.all());
    }

    this.readStream.pipe(sequenceStreamer);
}

var start = new Date();

if(process) {
  process.on('message', function(m){
    var finder = new ClosestPiSequencesFinder(m.firstStartDigit, m.lastDigitToRead);
    finder.findClosestSequences(function(e, hexGrid){
      process.send(hexGrid);
      process.disconnect();
    });
  });
}


