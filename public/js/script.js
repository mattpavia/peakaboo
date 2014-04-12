$(document).ready(function() {
    var color = $('.page').attr('class').split(' ')[1];
    $(".link." + color + "_hover").addClass("active");
});
