var Group = require('../models/group');

exports.index = function(req, res) {
    console.log("req.user = " + req.user);
    res.render('index.html', {
        title: 'Peekaboo'
    });
};

exports.group = function(req, res) {
    Group.findOne({'id': req.param('id')}, function(err, g) {
        if (err) {
            console.log(err);
        }
        if (g) {
            res.render('group.html', {
                title: 'Peekaboo',
                group: g
            });
        } else {
            res.render('error.html', {
                group: req.param('id')
            });
        }
    });
}