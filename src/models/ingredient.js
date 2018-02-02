var mongoose = require('mongoose');
var schema = require('../schemas/ingredient');

module.exports = mongoose.model('Ingredient', schema);