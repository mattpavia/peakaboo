
/**
 * Module dependencies.
 */

var http = require('http');
var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');
var socketio = require('socket.io');
var routes = require('./routes');

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);

var io = socketio.listen(server);

// use local arrays for storage for now
var messages = [];
var sockets = [];

io.on('connection', function(socket) {
    sockets.push(socket);

    messages.forEach(function(data) {
        socket.emit('message', data);
    });

    socket.on('message', function(data) {
        messages.push(data);

        sockets.forEach(function (socket) {
            socket.emit('message', data);
        });
    });

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    });
});

app.get('/', routes.index);
app.get('/:id', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
