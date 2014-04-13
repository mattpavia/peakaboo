/**
 * Module dependencies.
 */

var http = require('http');
var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');
var socketio = require('socket.io');
var routes = require('./routes');
var passport = require('passport');
var Message = require('./models/message');

var app = express();

// New
var mongoose = require('mongoose');
var configdb = require('./config/database');

mongoose.connect(configdb.url);

var test = require('./config/passport')(passport);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  // set up our express application
  app.use(express.logger('dev')); // log every request to the console
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.cookieParser('KITTENS')); // read cookies (needed for auth)
  app.use(express.bodyParser()); // get information from html forms
  app.use(express.json());

  // required for passport
  app.use(express.session({ secret: 'MOAR KITTENS' })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);

var io = socketio.listen(server);

// use local arrays for storage for now
var sockets = [];

io.on('connection', function(socket) {
    sockets.push(socket);

    Message.find(function(err, msg) {
      msg.forEach(function(m) {
        socket.emit('message', m);
      });
    });

    socket.on('message', function(data) {
        var msg = new Message({'group': data.group, 'data': data.msg});
        msg.save(function(err) {
          if (err) {
            console.log(err);
            return;
          }
        });

        sockets.forEach(function(socket) {
            socket.emit('message', msg);
        });
    });

    socket.on('disconnect', function() {
      sockets.splice(sockets.indexOf(socket), 1);
    });
});

require('./routes')(app, passport);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
