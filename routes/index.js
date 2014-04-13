var njglobals = require('nunjucks/src/globals');
var socketio = require('socket.io');
var Message = require('../models/message');
var Group = require('../models/group');
var User = require('../models/user');

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
                    if (g.user_1 === req.user.fid || g.user_2 === req.user.fid) {
                        res.render('group.html', {
                            title: 'Peekaboo',
                            group: g,
                            user: req.user
                        });
                    } else {
                        res.render('index.html', {
                            title: 'Peekaboo'
                        })
                    }
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
            var msg = new Message({'group': data.group, 'data': data.msg, 'sender': data.sender});
            msg.save(function(err) {
                if (err) {
                    console.error(err);
                    return;
                }
            });

            sockets.forEach(function(socket) {
                socket.emit('message', msg);
            });
        });

        socket.on('group', function(user_1) {
            console.log("recieved request to make new group...");
            var count = User.count({'fid' : { $ne : user_1 }});
            var rand = Math.floor(Math.random()*count);

            var uid = User.find({'fid' : { $ne : user_1 }}).limit(-1).skip(rand);
            Group.count().or([{'user_1' : user_1, 'user_2' : uid.fid}, {'user_1' : uid.fid, 'user_2' : user_1}]).exec(function(err, c) {
                var cnt = c;
                var i = 0;
                while ((i<10) && (cnt!=0)) {
                    rand = Math.floor(Math.random()*count);
                    uid = User.find({'fid' : { $ne : user_1 }}).limit(-1).skip(rand);
                    Group.count().or([{'user_1' : user_1, 'user_2' : uid.fid}, {'user_1' : uid.fid, 'user_2' : user_1}]).exec(function(err, c) {
                        cnt = c;
                    });
                    i++;
                }
                console.log("cnt=" + cnt);
                if (cnt == 0) {
                    var newGroup = new Group({'id': getNextSequence('groupid'), 'user_1' : user_1, 'user_2' : uid.fid, 'active' : true});
                    newGroup.save(function(err) {
                        if (err) {
                            console.error(error);
                            return;
                        }
                    });
                }
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
    res.redirect('/');
}
