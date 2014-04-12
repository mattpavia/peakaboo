exports.index = function(req, res) {
    res.render('index.html', {
        title: 'Peekaboo',
        id: req.param('id') || 1,
        color: 'green'
    });
};