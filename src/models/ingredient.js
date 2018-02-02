const mongoose = require('mongoose');
const schema = require('../schemas/ingredient');

module.exports = mongoose.model('Ingredient', schema);