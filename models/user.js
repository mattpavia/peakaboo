// user.js

var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	fbid : String
});

module.exports = mongoose.model('User', userSchema);