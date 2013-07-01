$(document).ready(function(){

  var updateMessages = function(){
    $.ajax('https://api.parse.com/1/classes/messages', {
      contentType: 'application/json',
      success: function(data){
        for(var i=0; i<data.results.length; i++) {
          data.results[i].username = data.results[i].username || 'unknown';
          var $tempContainer = $('<div class="messageContainer"></div>');
          $tempContainer.appendTo('#main');
          $tempContainer.append('<div class="created" />');
          $tempContainer.find('.created').text(moment(data.results[i].createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ").fromNow());
          $tempContainer.append('<div class="username" />');
          $tempContainer.find('.username').text('Username: ' + data.results[i].username);
          $tempContainer.append('<div class="text" />');
          $tempContainer.find('.text').text(data.results[i].text);

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
      'text': $('#newMessage').text()
    };
    $.ajax({
      type: "POST",
      url: 'https://api.parse.com/1/classes/messages',
      data: newMessage,
      success: function(){

      },
      dataType: 'json'
    });
  };

  var user = {};
  user.name = prompt('What is your username?', '');
  $('#username').text('Welcome ' + user.name);
  updateMessages();

});



