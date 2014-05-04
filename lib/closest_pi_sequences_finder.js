var fs = require('fs');

var ClosestSequences = require('./lib/closest_sequences');

exports = module.exports = ClosestPiSequencesFinder;

function ClosestPiSequencesFinder(firstStartDigit, lastStartDigit) {
  this.readStream = fs.createReadStream('pi-billion.txt', {
    encoding: 'utf-8',
    autoClose: true,
    start: firstStartDigit,
    end: lastStartDigit
  });
};



var Transform = require('stream').Transform;


var soundcloudSequence = [0, 0, 0, 0, 0, 3, 3, 9, 9, 9, 6, 0, 0, 0, 
                          0, 0, 0, 3, 4, 9, 5, 9, 9, 9, 9, 4, 0, 0,
                          0, 1, 2, 7, 5, 9, 5, 9, 9, 9, 9, 7, 1, 0,
                          3, 9, 5, 9, 5, 9, 5, 9, 9, 9, 9, 9, 9, 3,
                          6, 9, 5, 9, 5, 9, 5, 9, 9, 9, 9, 9, 9, 6,
                          1, 8, 5, 9, 5, 9, 5, 9, 9, 9, 9, 9, 8, 1],

ClosestPiSequencesFinder.protype.findClosestSequence = function(callback) {
  var closestSequences = new ClosestSequences(soundcloudSequence, 10),
    sequence = [];

    var sequenceStreamer = new Transform();

    sequenceStreamer._transform = function(chunk, encoding, next) {
      var result = [];
      // console.log(data.toString());
      var dataString = chunk.toString();

      for(var i = 0; i < dataString.length; i++){
        sequence.push(parseInt(dataString[i]));

        if(sequence.length > 84) {
          sequence.shift();
          closestSequences.insert(sequence);
        }
        else if(sequence.length == 84)
          closestSequences.insert(sequence);
      }

      next();
    };

    // when done processing all sequences, convert into a
    // grid and output it
    sequenceStreamer._flush = function(){
      var hexGrid = closestSequences.all().map(function(sequence){
        var result = [];
        var index = 0;

        // turn into 14 x 6 hex grid
        for(var i = 0; i < 6; i++) {
          result.push([]);
          for(var j = 0; j < 14; j++) {
            result[i].push(sequence[index]);
            index++;
          }
        }

        return result;
      });

      var totalTime = new Date() - start;

      callback(null, results);
    }
}

var start = new Date();

readStream.pipe(sequenceStreamer);


