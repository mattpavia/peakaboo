// user.js

var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	id : String,
	token : String,
	name : String,
    email: String,
	age : int,
	birthday : String,
	picture : String,
	location : String,
	hometown : String,
	employers : String,
	education  :String,
	relationship : String,
	sports : String,
	music : String,
	movies : String,
	tvshows : String,
	books : String,
	likes : String,
	events : String,
	groups : String,
	fitness : String,
	website : String
});

module.exports = mongoose.model('User', userSchema);