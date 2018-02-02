const mongoose = require('mongoose');
const schema = require('../schemas/step');

module.exports = mongoose.model('Step', schema);