// user.js
/*
 * Set to:
 *	0 when profile viewer doesn't have the element in their profile
 *  1 when profile owner doesn't have the element in their profile
 *  2 when neither has the element
 *  3 when both have the element but it is locked (default for common elements)
 *	4 when both have the element and it is unlocked
 *
 */
var mongoose = require('mongoose');
var profileSchema = mongoose.Schema({
	profileViewer : String,
	profileOwner : String,
	name : int,
	age : int,
	birthday : int,
	picture : int,
	location : int,
	hometown : int,
	employers : int,
	education  : int,
	relationship : int,
	sports : int,
	music : int,
	movies : int,
	tvshows : int,
	books : int,
	likes : int,
	events : int,
	groups : int,
	fitness : int,
	website : int
});
module.exports = mongoose.model('Profile', profileSchema);