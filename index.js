var fs = require('fs');

var readStream = fs.createReadStream('pi-billion.txt', {
  encoding: 'utf-8',
  autoClose: true,
  start: 2,
  end: 10
});

var Transform = require('stream').Transform;

var numberParser = new Transform();
numberParser._transform = function(data, encoding, next) {
  var result = [];
  // console.log(data.toString());
  var dataString = data.toString();

  console.log('reading');

  for(var i = 0; i < dataString.length; i++){
    this.push(dataString[i]);
  }
  next();
};

numberParser.on('error', function(e, err){
  console.log(e);
});

var Writable = require('stream').Writable;

var output = new Writable();

output._write = function(chunk, encoding, callback){
  console.log(chunk.toString());
  callback();
}

console.log('piping');

readStream.pipe(numberParser).pipe(output);


// readStream.on('open', function () {
//   // This just pipes the read stream to the response object (which goes to the client)
//   readStream.pipe(res);
// });

