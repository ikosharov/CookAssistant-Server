var mongoose = require('mongoose');
var schema = require('../schemas/step');

module.exports = mongoose.model('Step', schema);