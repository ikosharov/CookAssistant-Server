const mongoose = require('mongoose');
const schema = require('../schemas/user');

module.exports = mongoose.model('User', schema);