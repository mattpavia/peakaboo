$(document).ready(function() {
	cleanUp();
});

function getUID() {
	var stat = false;
	if (stat) {
		return "123324";
	} else {
		id = readCookie("fid");
		return id;
	}
}
function setUID(uid) {
	writeCookie('fid', uid);
}

function newChat() {
	var socket = io.connect();
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
	var addition = '<div class="link ' + color + '_hover" data-color="' + color + '"><a href="/group/' + cnt + '" ' +  'onClick="pageColor(' + color + ')"><i class="fa fa-' + icon + '"></i> <span>Group ' + cnt + '</span></a></div>';
    $(".nav").append(addition);
}
function pageColor(color) {
	console.log(color);
	$('.page').removeClass($('.page').attr('class').split(' ')[1]);
	$('.page').addClass(color);
    $(".link." + color + "_hover").addClass("active");
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
		data1 = data1.replace("pageColor('')", "pageColor('" + color + "')");
		var data2 = data[1];
		newHTML += '<div class="link ' + color + '_hover"' + ' data-color="' + color + '"' + data1 + '<i class="fa fa-' + icon + '">' + data2;
		newHTML = newHTML.substring(0, newHTML.length-1);
	}
	$('.nav').html(newHTML);
	//cleanUpPages();
}
function writeCookie(c_name, c_value) {
	document.cookie = c_name + "=" + c_value;
}
function readCookie(c_name) {
	var name = c_name + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if(c.indexOf(name)==0) return c.substring(name.length, c.length);
	}
}

function scrollToBottom() {
	var div = $('.messages');
	div.scrollTop(div.prop("scrollHeight") - div.height());
	return;
}
