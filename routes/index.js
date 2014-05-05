var multiCoreClosestPiSequencesFinder = require('../lib/multi_core_closest_pi_sequences_finder'),
  soundcloud = require('../lib/soundcloud');


// get home page
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

var numDigits = 1000000000;
// need to use 1 less cpu than total, since 1 cpu is
// dedicated to running app
var numberAvailableCPUs = require('os').cpus().length - 1;

// calculate results
exports.calculateResults = function(req, res){
  var start = new Date();

  multiCoreClosestPiSequencesFinder.findUsingMultipleCores(numberAvailableCPUs, numDigits, function(err, results){    
    var end = new Date();
    var timeElapsed = end - start;

    var model = converToModel(timeElapsed, results);
    
    res.render('results', model);
  });
}
// helper meethods
var converToModel = function(timeElapsed, results) {
  var resultsWithSequencesAsGrid = results.map(function(result){
    return {
      rows : soundcloud.convertToGrid(result.sequence),
      offset : result.offset,
      differenceScore : result.differenceScore
    };
  });

  return {
    timeElapsed : numberWithCommas(timeElapsed),
    numberOfDigits : numberWithCommas(numDigits),
    numberOfCores : numberAvailableCPUs,
    soundcloudLogo : soundcloud.sequenceAsGrid(),
    results : resultsWithSequencesAsGrid
  };
};

// taken from http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}