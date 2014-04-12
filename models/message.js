// message.js

var mongoose = require('mongoose');
var messageSchema = mongoose.Schema({
	sender : String,
	group : Number,
	data : String,
	time : Timestamp
});

module.exports = mongoose.model('Message', messageSchema);