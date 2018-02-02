var mongoose = require('mongoose');
var schema = require('../schemas/recipe');

module.exports = mongoose.model('Recipe', schema);