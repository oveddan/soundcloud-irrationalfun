var multiCoreClosestPiSequencesFinder = require('./lib/multi_core_closest_pi_sequences_finder');

var numDigits = 1000000;

var start = new Date();

multiCoreClosestPiSequencesFinder.findUsingMultipleCores(8, numDigits, function(err, results){    
  console.log('for num digits ' + numDigits);
  var end = new Date();
  console.log('time elapsed ' + (end - start) + 'ms');
  console.log('results:');
  console.log(results); 
});



