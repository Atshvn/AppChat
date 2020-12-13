
$(document).ready(function(){
    var socket = io();
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    var userPic = $('#name-image').val();
    socket.on('connect', function(){
        
        var params = {
            room: room,
            name: sender
        }
        socket.emit('join', params, function(){
            //console.log('User has joined this room');
        });
    });

    // socket.on('usersList', function(users){
    //     var ol = $('<ol></ol>');

    //     for(var i = 0; i< users.length; i++){
    //          ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
    //     }
    //     $(document).on('click', '#val', function(){
    //         $('#name').text('@'+$(this).text());
    //         $('#receiverName').val($(this).text().trim());
    //         $('#nameLink').attr("href", "/profile/"+$(this).text());
    //     });
    //     $('#numValue').text('('+users.length+')');
    //     $('#users').html(ol);
    // })

    socket.on('newMessage', function(data){
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from,
            userImage: data.image
        });
        
        $('#messages').append(message);
    });

    $('#message-form').on('submit', function(e){
        e.preventDefault();
        var msg = $('#msg').val();
        socket.emit('createMessage', {
            text: msg,
            room: room,
            sender: sender,
            userPic: userPic
        }, function(){
            $('#msg').val('');
        });
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                message: msg,
                groupName: room
            },
            success: function(){
                $('#msg').val('');
            }
        })
    });
    $('#register-form').on('submit',function(e) {
        e.preventDefault();
    
        $.ajax({
           type: 'POST',
           url: $(this).attr('action'),
           data : $(this).serialize(),
           success : function(response) {
               //write your code here
           } 
       })
    });
    $('.chat_area').on('DOMSubtreeModified', function () {
        $('.chat_area').animate({ scrollTop: $('#messages').prop("scrollHeight") }, 500);
        });
    $('.message_write').keypress(function (e) {
        if (e.which == 13) {

            $('#send-message').click();


        }
    });
    $('.chat-body').on('click', function(){
        ($(".time-none").css("display") == "none")?
            $(".time-none").addClass("time-chat"):
            $(".time-none").removeClass("time-chat")
       
        
    })
})