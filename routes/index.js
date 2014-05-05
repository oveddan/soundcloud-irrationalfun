var multiCoreClosestPiSequencesFinder = require('../lib/multi_core_closest_pi_sequences_finder'),
  soundcloud = require('../lib/soundcloud');


// get home page
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

var numDigits = 100000000;
var numCPUs = require('os').cpus().length;

// calculate results
exports.calculateResults = function(req, res){
  var start = new Date();

  multiCoreClosestPiSequencesFinder.findUsingMultipleCores(numCPUs, numDigits, function(err, results){    
    var end = new Date();
    var timeElapsed = end - start;

    var model = converToModel(timeElapsed, results);
    
    res.render('results', model);
  });
}
// helper meethods
var converToModel = function(timeElapsed, results) {
  var sortedResults = results.sort(function(a, b){
    if(a.differenceScore < b.differenceScore)
      return -1;
    else
      return 1;
  });

  var resultsWithSequencesAsGrid = sortedResults.map(function(result){
    return {
      rows : soundcloud.convertToHexGrid(result.sequence),
      offset : result.offset
    };
  });

  return {
    timeElapsed : timeElapsed,
    results : resultsWithSequencesAsGrid
  };
};