$(document).ready(function(){

  var updateMessages = function(){
    var lastPulled = lastPulled || '1900-01-01T00:00:00.000Z';
    $.ajax({
      type: "GET",
      url: 'https://api.parse.com/1/classes/messages',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function(data){
        // remove messages if more than 10
          // remove div:eq > 20
        // add new messages
        for(var i = data.results.length - 1; i >= 0; i--){
          // update timestamp for older messages
          if (data.results[i].createdAt <= lastPulled){
            // for all divs
            // if id =
            // update created at
          } else {
          // make a new div for new messages
            data.results[i].username = data.results[i].username || 'unknown';
            var $tempContainer = $('<div class="messageContainer"></div>');
            $tempContainer.prependTo('#main');
            $tempContainer.append('<div class="created" />');
            $tempContainer.find('.created').text(moment(data.results[i].createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ").fromNow());
            $tempContainer.append('<div class="username" />');
            $tempContainer.find('.username').text('Username: ' + data.results[i].username);
            $tempContainer.append('<div class="text" />');
            $tempContainer.find('.text').text(data.results[i].text);
          }
        }
        console.log(data);
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
    setTimeout(updateMessages, 3000);
  };

  var sendMessage = function(message){
    var newMessage = {
      'username': user.name,
      'text': message
    };
    $.ajax({
      type: "POST",
      url: 'https://api.parse.com/1/classes/messages',
      contentType: 'application/json',
      data: JSON.stringify(newMessage),
      success: function(){
        updateMessages();
      },
      error: function(req, err){
        console.log('error: ',err);
        console.log('Could not post new message!!');
      }
    });
  };

  $('#newMessage').on('submit', function(e){
    e.preventDefault();
    sendMessage($('input').val());
    $('input').val(null);
  });

  var user = {};
  user.name = prompt('What is your username?', '') || 'guest';
  $('#username').text('Welcome ' + user.name);
  updateMessages();

});



