var fs = require('fs'),
  util = require('util');

var multiCoreClosestPiSequencesFinder = require('./lib/multi_core_closest_pi_sequences_finder'),
  soundcloud = require('./lib/soundcloud');

var numDigits = 10000000;
var numCPUs = require('os').cpus().length;

var start = new Date();

multiCoreClosestPiSequencesFinder.findUsingMultipleCores(numCPUs, numDigits, function(err, results){    
  var end = new Date();
  var timeElapsed = end - start;

  var resultsForView = convertForView(timeElapsed, results);
  
  populateResultsIntoHtmlFile(resultsForView);
});

var convertForView = function(timeElapsed, results) {
  var sortedResults = results.sort(function(a, b){
    if(a.differenceScore < b.differenceScore)
      return -1;
    else
      return 1;
  });

  var resultsWithSequencesAsGrid = sortedResults.map(function(result){
    return {
      sequenceGrid : soundcloud.convertToHexGrid(result.sequence),
      offset : result.offset
    };
  });

  return {
    timeElapsed : timeElapsed,
    results : resultsWithSequencesAsGrid
  };
};

var populateResultsIntoHtmlFile = function(model) {
  fs.readFile('results_viewer.html.template', function(err, templateContents){
    // todo: use an actual templating engine
    var html = templateContents.toString().
      replace("{results}", util.inspect(model.results)).
      replace("{timeElapsed}", model.timeElapsed);

    fs.writeFile('results_viewer.html', html, function(err, result){
      console.log('Closest sequences written to results_viewer.html');
    });
  });
}



