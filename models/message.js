// message.js

var mongoose = require('mongoose');
var messageSchema = mongoose.Schema({
	sender : String,
	receiver : String,
	data : String,
	time : Timestamp
});

module.exports = mongoose.model('Message', messageSchema);