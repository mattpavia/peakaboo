// message.js

var mongoose = require('mongoose');
var messageSchema = mongoose.Schema({
	sender : String,
	group : String,
	data : String,
	time : String
});

module.exports = mongoose.model('Message', messageSchema);