/**
 * Module dependencies.
 */

var http = require('http');
var express = require('express');
var nunjucks = require('nunjucks');
var njglobals = require('nunjucks/src/globals');
var path = require('path');
var socketio = require('socket.io');
var routes = require('./routes');
var passport = require('passport');

var app = express();

// New
var mongoose = require('mongoose');
var configdb = require('./config/database');

mongoose.connect(configdb.url);

require('./config/passport')(passport);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

var Group = require('./models/group');
Group.find().or([{'user_1': 'Matt'}, {'user_2': 'Matt'}]).exec(function(err, groups) {
  njglobals.groupList = groups;
});

// all environments
// app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hjs');
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
// app.use(express.cookieParser('your secret here'));
// app.use(express.session());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  // set up our express application
  app.use(express.logger('dev')); // log every request to the console
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.cookieParser('KITTENS')); // read cookies (needed for auth)
  app.use(express.bodyParser()); // get information from html forms
  app.use(express.json());
  //app.set('view engine', 'ejs'); // set up ejs for templating

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

// app.get('/', routes.index);
// app.get('/:id', routes.index);

app.get('/login', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
app.get('/login/callback', passport.authenticate('facebook', {
  successRedirect : '/worked',
  failureRedirect : '/notworked'
}));

// route for logging out
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
