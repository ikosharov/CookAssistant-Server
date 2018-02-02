const mongoose = require('mongoose');
const schema = require('../schemas/image');

module.exports = mongoose.model('Image', schema);