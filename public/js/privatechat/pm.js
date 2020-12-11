$(document).ready(function () {
    var socket = io();
    var name = $('#name-user').val();
    var paramOne = $.deparam(window.location.pathname);
    var newParam = paramOne.split('.');
    var userPic = $('#name-image').val();
    var username = newParam[0];
    $('#receiver_name').text('@' + username);
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
    swap(newParam, 0, 1);
    var paramTwo = newParam[0] + '.' + newParam[1];


    socket.on('connect', function () {
        var params = {
            room1: paramOne,
            room2: paramTwo
        }
        socket.emit('join chat', params);
        socket.on('message display', function () {
            $('#reload').load(location.href + ' #reload');
            console.log("Hisd");
        });
    });
    socket.on('new refresh', function () {
        $('#reload').load(location.href + ' #reload');
     


    });
    socket.on('new message', function (data) {
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.sender,
            userImage: data.image,
            formattedTime: formattedTime
        });
        var template2 = $('#message-template2').html();
        var message2 = Mustache.render(template2, {
            text: data.text,
            sender: data.sender,
            userImage: data.image,
            formattedTime: formattedTime
        });
        if (name == data.sender) {
            $('#messages').append(message);
            console.log("hihi");
        }
        else {

            $('#messages').append(message2);
            console.log("name");
            console.log("sender");
        }

        // $('#messages').load(location.href + ' #messages');

    });
    $('.chat_area').on('DOMSubtreeModified', function () {
        $('.chat_area').animate({ scrollTop: $('#messages').prop("scrollHeight") }, 500);
        });
    $('.message_write').keypress(function (e) {
        if (e.which == 13) {

            $('#send-message').click();


        }
    });
    $('#message_form').on('submit', function (e) {
        e.preventDefault();
        var msg = $('#msg').val();
        var sender = $('#name-user').val();

        if (msg.trim().length > 0) {
            socket.emit('private message', {
                text: msg,
                sender: sender,
                room: paramOne,
                userPic: userPic,
                formattedTime: formattedTime
            }, function () {
                $('#msg').val('');
            });
        }
    });
    $('#send-message').on('click', function () {
        var message = $('#msg').val();
       // $('.chat_area').animate({ scrollTop: $('#messages').prop("scrollHeight") }, 500);
        $.ajax({
            url: '/chat/' + paramOne,
            type: 'POST',
            data: {
                message: message
            },
            success: function () {
                $('#msg').val('');
            }
        })
    });
    $('.chat-body').on('click', function(){
        ($(".time-none").css("display") == "none")?
            $(".time-none").addClass("time-chat"):
            $(".time-none").removeClass("time-chat")
       
        
    })

})

function swap(input, value_1, value_2) {
    var temp = input[value_1];
    input[value_1] = input[value_2];
    input[value_2] = temp;
    // body
}