$(document).ready(function() {

    var socket = io.connect();

    $(".interact").submit("click", function(e) {
        var form = $(this);
        e.preventDefault();
        if ($(".input").val().length !== 0) {
            socket.emit('message', {
                msg: $(".input").val(),
                group: form.data('id'),
                sender: getUID()
            });
        }
        $(".input").val("");
    });

    socket.on('message', function(msg) {
        console.log(msg.sender);
        if (msg.sender === getUID()) {
            $(".messages").append("<div class='me'>" + msg.data + "</div>");
        } else {
            $(".messages").append("<div class='other'>" + msg.data + "</div>");
        }
        scrollToBottom();
    });
    socket.on('fid', function(fid) {
        setUID(fid);
    });
});
