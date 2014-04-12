// messages.js

var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	{
		sender : String,
		receiver : String,
		data : String,
		time : Timestamp
		
	}

});

module.exports = mongoose.model('messages', userSchema);