$(document).ready(function(){
  $('form').on('submit', function(e){
    var $submitButton = $(this).find('input[type=\'submit\']');
    $submitButton.attr('disabled', 'disabled');
    $submitButton.val('Please wait while the results are being calculated...');
  });
});