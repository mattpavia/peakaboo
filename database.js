// lvhacks Peekaboo
// database.js

var db = require('mongodb').Db,
    Server = require('mongodb').Server,
    assert = require('assert');

var db = new db('peekaboo', new Server("mattpavia.com", 27017,
	{auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});

// Establish connection to db
exports.test = function() {
    db.open(function(err, db) {
        assert.equal(null, err);
        db.authenticate('peekaboo', 'lvhacks2014', function(err, result) {
            assert.equal(true, result);
            db.peekaboo.insert({x : 1});
        });
    });
}
db.close();
