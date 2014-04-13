// group.js

var mongoose = require('mongoose');
var groupSchema = mongoose.Schema({
    user_1: String,
    user_2: String,
    active: Boolean,
    hash: String

});

module.exports = mongoose.model('Group', groupSchema);