var mongoose = require('mongoose');
var ingredientSchema = require('./ingredient');
var stepSchema = require('./step');

var ratingValidator = [
    function (val) {
        return val >= 0 && val <= 5;
    },
    "rating should be between 0 and 5 stars"
];

var schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  ingredients: [ ingredientSchema ],
  steps: [ stepSchema ],
  image: { 
    data: Buffer,
    contentType: String
  },
  rating: {
    type: Number,
    default: 0,
    validator: ratingValidator
  }
});

module.exports = schema;