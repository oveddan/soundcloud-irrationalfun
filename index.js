var fs = require('fs');

var readStream = fs.createReadStream('pi-billion.txt', {
  encoding: 'utf-8',
  autoClose: true,
  start: 2,
  end: 1000000
});

var Transform = require('stream').Transform;

var sequenceStreamer = new Transform();
sequenceStreamer._transform = function(chunk, encoding, next) {
  var result = [];
  // console.log(data.toString());
  var dataString = chunk.toString();

  for(var i = 0; i < dataString.length - 84; i++){
    
    this.push(dataString.slice(i, i + 84));
  }

  next();
};


