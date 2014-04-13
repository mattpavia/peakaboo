var njglobals = require('nunjucks/src/globals');
var socketio = require('socket.io');
var Message = require('../models/message');
var Group = require('../models/group');

module.exports = function(app, server, passport) {

    var io = socketio.listen(server);
    var sockets = [];

    io.on('connection', function(socket) {
        sockets.push(socket);

        app.get('/group/:id', isLoggedIn, function(req, res) {
            socket.emit('fid', req.user.fid);
            
            Group.find().or([{'user_1': req.user.fid}, {'user_2': req.user.fid}]).exec(function(err, groups) {
              njglobals.groupList = groups;
            });
            
            Group.findOne({'id': req.param('id')}, function(err, g) {
                if (err) {
                    console.log(err);
                }
                if (g) {
                    res.render('group.html', {
                        title: 'Peekaboo',
                        group: g,
                        user: req.user
                    });
                } else {
                    res.render('error.html', {
                        group: req.param('id')
                    });
                }
            });
        });

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

    app.get('/', function(req, res) {
        res.render('index.html', {
            title: 'Peekaboo'
        });
    });

    app.get('/login', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/login/callback', passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));

    // route for logging out
    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}