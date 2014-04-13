$(document).ready(function() {

    var socket = io.connect();

    $(".interact").submit("click", function(e) {
        var form = $(this);
        e.preventDefault();
        socket.emit('message', {
            msg: $(".input").val(),
            group: form.data('id')
        });
        $(".input").val("");
    });

    socket.on('message', function(msg) {
        console.log("new message recieved: " + msg.data);
        if (msg.sender == getUID()) {
            $(".messages").append("<div class='me'>" + msg.data + "</div>");
        } else {
            $(".messages").append("<div class='other'>" + msg.data + "</div>");
        }
        scrollToBottom();
    });

});
