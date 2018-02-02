const mongoose = require('mongoose');
const schema = require('../schemas/recipe');

module.exports = mongoose.model('Recipe', schema);