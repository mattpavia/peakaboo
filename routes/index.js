var Group = require('../models/group');

module.exports = function(app, passport) {

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

    app.get('/group/:id', isLoggedIn, function(req, res) {
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
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/error');
}