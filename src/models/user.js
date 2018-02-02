var mongoose = require('mongoose');
var schema = require('../schemas/user');

module.exports = mongoose.model('User', schema);