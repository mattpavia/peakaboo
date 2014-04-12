// group.js

var mongoose = require('mongoose');
var groupSchema = mongoose.Schema({
    id: Number,
    user_1: String,
    user_2: String,
    active: Boolean
});

module.exports = mongoose.model('Group', groupSchema);