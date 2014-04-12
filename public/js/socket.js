$(document).ready(function() {

    var socket = io.connect();

    $(".interact").submit("click", function(e) {
        e.preventDefault();
        socket.emit('message', {
            msg: $(".input").val()
        });
        $(".input").val("");
    });

    socket.on('message', function(data) {
        console.log("new message recieved: " + data.msg);
        $(".messages").append("<div class='me'>" + data.msg + "</div>");
    });

});