$(document).ready(function(){

  var updateMessages = function(lastPulled){
    var dataString;
    if (user.activeRoom === null || user.activeRoom === 'the hallway') {
      dataString = 'where={"createdAt":{"$gt":{"__type":"Date","iso":"' + user.lastPulled + '"}}}&order=-createdAt&limit=20';
    } else {
      dataString = 'where={"createdAt":{"$gt":{"__type":"Date","iso":"' + user.lastPulled + '"}},"roomname":"'+user.activeRoom+'"}&order=-createdAt&limit=20';
    }

    $.ajax({
      type: "GET",
      url: 'https://api.parse.com/1/classes/messages',
      // data: 'where={"createdAt":{"$gte":{"__type":"Date","iso":"' + lastPulled + '"}}}&order=-createdAt&limit=20',
      // data: 'where={"$and":[{"createdAt":{"$gte":{"__type":"Date","iso":"' + lastPulled + '"}}},{"roomname":"' + user.activeRoom + '"}]}&order=-createdAt&limit=20'
      data: dataString,
      contentType: 'application/json',
      success: function(data){
        if (data.results[0]) {
          // remove messages if more than 20
          $('.messageContainer:gt(19)').remove();
          // add new messages
          for(var i = data.results.length - 1; i >= 0; i--){
              data.results[i].username = data.results[i].username || 'unknown';
              var $tempContainer = $('<div class="messageContainer"> \
                                        <div class="created" /> \
                                        <div class="username"><a href="#" class="usernameLink"/></div> \
                                        <div class="text" /> \
                                      </div>').prependTo('#main');
              for (var key in user.friends) {
                key === data.results[i].username && $tempContainer.addClass('friend');
              }
              $tempContainer.find('.created').text(moment(data.results[i].createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ").fromNow());
              $tempContainer.find('.usernameLink').text('@' + data.results[i].username);
              $tempContainer.find('.text').text(data.results[i].text);
          }
          user.lastPulled = data.results[0].createdAt;
        }
        console.log(data);
        setTimeout(updateMessages, 1000, lastPulled);
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
  };

  var sendMessage = function(message){
    var newMessage = {
      'username': user.name,
      'text': message,
      'roomname': user.activeRoom
    };
    $.ajax({
      type: "POST",
      url: 'https://api.parse.com/1/classes/messages',
      contentType: 'application/json',
      data: JSON.stringify(newMessage),
      success: function(){
      },
      error: function(req, err){
        console.log('error: ',err);
        console.log('Could not post new message!!');
      }
    });
  };

  var user = {
    friends: {},
    activeRoom: null,
    lastPulled: '1900-01-01T00:00:00.000Z'
  };

  // check is username is passed in the url, if not promt for it
  if(/username/i.test(location.href)) {
    var loc = location.href.split('username=');
    loc = loc[1].split('&');
    user.name = loc[0];
  } else {
    user.name = prompt('What is your username?', '') || 'guest';
  }


  $('#newMessage').on('submit', function(e){
    e.preventDefault();
    sendMessage($(this).find('input').val());
    $(this).find('input').val(null);
  });

  $('#currentRoom').on('submit', function(e){
    e.preventDefault();
    user.activeRoom = $(this).find('input').val();
    $(this).find('input').attr('placeholder', "You're chatting in " + user.activeRoom).val(null);
    $('#main').html(null);
    user.lastPulled = '1900-01-01T00:00:00.000Z';
  });

  $('#defaultRoom').on('click', function(e){
    e.preventDefault();
    user.activeRoom = 'the hallway';
    $('#currentRoom').find('input').attr('placeholder', "You're chatting in " + user.activeRoom).val(null);
    $('#main').html(null);
    user.lastPulled = '1900-01-01T00:00:00.000Z';
  });

  $('#main').delegate('.usernameLink', 'click', function(e){
    e.preventDefault();
    user.friends[$(this).text().substring(1)] = true;
  });

  // $('<div class="loading" />')
  //   .ajaxStart(function() {
  //       $(this).prependTo('#main');
  //   })
  //   .ajaxStop(function() {
  //       $(this).remove();
  //   });


  $('#username').text(user.name + ': ');
  updateMessages();
});
