// lvhacks Peekaboo
// database.js

var db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var db = new Db('peekaboo', new Server("mattpavia.com", 27017,
	{auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});

// Establish connection to db
db.open(function(err, db) {
    assert.equal(null, err);
    db.authenticate('peekaboo', 'lvhacks2014', function(err, result) {
        assert.equal(true, result);
        db.peekaboo.insert({x : 1});
    });
});
db.close();