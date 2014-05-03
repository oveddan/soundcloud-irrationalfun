var fs = require('fs');

var readStream = fs.createReadStream('pi-billion.txt', {
  encoding: 'utf-8',
  autoClose: true,
  start: 2,
  end: 100
});

var Transform = require('stream').Transform;

var characterStreamer = new Transform();
characterStreamer._transform = function(chunk, encoding, next) {
  var result = [];
  // console.log(data.toString());
  var dataString = chunk.toString();

  for(var i = 0; i < dataString.length; i++){
    console.log('pushing: ');
    console.log(dataString[i]);
    this.push(dataString[i]);
  }
  next();
};

characterStreamer.on('error', function(e, err){
  console.log(e);
});

var Writable = require('stream').Writable;

var sequenceStreamer = new Transform({ objectMode: true });

sequenceStreamer._transform = function(chunk, encoding, next){
  var sequence = [];
  for(var i = 0; i < 84; i++) {
    console.log('pulling: ');
    console.log(parseInt(chunk.toString()));
    sequence[i] = parseInt(chunk.toString());
    next();
  }
  this.push(sequence);
  next();
}

sequenceStreamer.on('error', function(e, err){
  console.log(e);
});

readStream.pipe(characterStreamer).pipe(sequenceStreamer);


// readStream.on('open', function () {
//   // This just pipes the read stream to the response object (which goes to the client)
//   readStream.pipe(res);
// });

