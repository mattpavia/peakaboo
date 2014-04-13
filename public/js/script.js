$(document).ready(function() {
    var color = $('.page').attr('class').split(' ')[1];
    $(".link." + color + "_hover").addClass("active");
    cleanUp();
});

function getUID() {
	return "123324";
}

function newChat() {
	var content = $(".nav").html();
	var arr = content.split('<div class="link');
	var colors = ['green', 'teal', 'blue', 'purple', 'red', 'orange', 'yellow'];
	var icons = ['home', 'comments', 'thumb-tack', 'users', 'user', 'trophy', 'envelope-o'];
	var cnt = arr.length;
	socket.emit('group', {
        fid: getUID()
    });
	var color = colors[cnt%colors.length];
	var icon = icons[cnt%icons.length];
	var addition = '<div class="link ' + color + '_hover" data-color="' + color + '"><a href="/group/' + cnt + '"><i class="fa fa-' + icon + '"></i> <span>Group ' + cnt + '</span></a></div>';
    $(".nav").append(addition);
}

function cleanUp() {
	var colors = ['green', 'teal', 'blue', 'purple', 'red', 'orange', 'yellow'];
	var icons = ['home', 'comments', 'thumb-tack', 'users', 'user', 'trophy', 'envelope-o'];
	var content = $(".nav").html();
	var arr = content.split('div class="link green_hover');
	var cnt = arr.length;
	var newHTML = "";
	for (var i=1; i<cnt; i++) {
		var color = colors[Math.floor(i/2)%colors.length];
		var icon = icons[Math.floor(i/2)%icons.length];
		var j = arr[i].indexOf(">");
		var datas = arr[i].substring(j);
		data = datas.split('<i class="fa fa-home">')
		var data1 = data[0];
		var data2 = data[1];
		newHTML += '<div class="link ' + color + '_hover"' + ' data-color="' + color + '"' + data1 + '<i class="fa fa-' + icon + '">' + data2;
		newHTML = newHTML.substring(0, newHTML.length-1);
	}
	$('.nav').html(newHTML);
}
function writeCookie(c_name, c_value, c_dur) {
	var d = new Date();
	d.setTime(d.getTime() + c_dur*24*60*60*1000);
	var expires = "expires=" + d.toGMTString();
	document.cookie = c_name + "=" + c_value + "; " + expires;
}
function readCookie(c_name) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if(c.indexOf(name)==0) return c.substring(name.length, c.length);
	}
}

function scrollToBottom() {
	var div = $('.messages');
	div.animate({scrollTop: div.prop("scrollHeight") - div.height()}, 500);
	return;
}
