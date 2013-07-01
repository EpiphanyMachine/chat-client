$(document).ready(function(){

  var updateMessages = function(){
    var lastPulled = lastPulled || '1900-01-01T00:00:00.000Z';
    $.ajax({
      type: "GET",
      url: 'https://api.parse.com/1/classes/messages',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function(data){
        // remove messages if more than 20
        $('.messageContainer:gt(19)').remove();
        // add new messages
        for(var i = data.results.length - 1; i >= 0; i--){
          if (data.results[i].createdAt <= lastPulled){
            // update timestamp for older messages
              // for all divs
              // if id =
              // update created at
          } else {
          // make a new div for new messages and add data
            data.results[i].username = data.results[i].username || 'unknown';
            var $tempContainer = $('<div class="messageContainer"> \
                                      <div class="created" /> \
                                      <div class="username"><a href="#" class="usernameLink"/></div> \
                                      <div class="text" /> \
                                    </div>').prependTo('#main');
            $tempContainer.find('.created').text(moment(data.results[i].createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ").fromNow());
            $tempContainer.find('.usernameLink').text('@' + data.results[i].username);
            $tempContainer.find('.text').text(data.results[i].text);
          }
        }
        lastPulled = data.results[0].createdAt;
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

  var user = {
    friends: []
  };
  user.name = prompt('What is your username?', '') || 'guest';
  $('#username').text(user.name + ': ');
  updateMessages();

  $('#newMessage').on('submit', function(e){
    e.preventDefault();
    sendMessage($('input').val());
    $('input').val(null);
  });

  $('.usernameLink').on('click', function(e){
    e.preventDefault();
    user.friends.push(this.text());
  });


});



