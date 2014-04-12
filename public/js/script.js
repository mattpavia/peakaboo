$(document).ready(function() {
    var color = $('.page').attr('class').split(' ')[1];
    $(".link." + color + "_hover").addClass("active");
});
function newChat() {
	var content = $(".nav").html();
	var arr = content.split('<div class="link');
	var colors = ['green', 'teal', 'blue', 'purple', 'red', 'orange', 'yellow'];
	var icons = ['home', 'comments', 'thumb-tack', 'users', 'user', 'trophy', 'envelope-o'];
	var cnt = arr.length;
	var color = colors[cnt%colors.length];
	var icon = icons[cnt%icons.length];
	var addition = '<div class="link ' + color + '_hover" data-color="' + color + '"><a href="/' + cnt + '"><i class="fa fa-' + icon + '"></i> <span>Group ' + cnt + '</span></a></div>';
    $(".nav").append(addition);
}
