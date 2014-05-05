var ClosestSequences = require('./closest_sequences');

var sequence = [0, 0, 0, 0, 0, 3, 3, 9, 9, 9, 6, 0, 0, 0, 
                0, 0, 0, 3, 4, 9, 5, 9, 9, 9, 9, 4, 0, 0,
                0, 1, 2, 7, 5, 9, 5, 9, 9, 9, 9, 7, 1, 0,
                3, 9, 5, 9, 5, 9, 5, 9, 9, 9, 9, 9, 9, 3,
                6, 9, 5, 9, 5, 9, 5, 9, 9, 9, 9, 9, 9, 6,
                1, 8, 5, 9, 5, 9, 5, 9, 9, 9, 9, 9, 8, 1],
    numberOfResults = 10;

var soundcloud = {
  buildClosestSequencesFinder : function() {
    return new ClosestSequences(sequence, numberOfResults);
  },
  sequenceLength : sequence.length,
  firstDigit : 2,
  sequenceAsGrid : function(){
    return soundcloud.convertToGrid(sequence)
  },
  convertToGrid : function(sequence) {
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
  }
}

exports = module.exports = soundcloud;




