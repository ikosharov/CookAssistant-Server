const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = Schema.Types
const ingredientSchema = require('./ingredient');
const stepSchema = require('./step');

const ratingValidator = [
  function (val) {
    return val >= 0 && val <= 5;
  },
  "rating should be between 0 and 5 stars"
];

const schema = new Schema({
  title: {
    type: Types.String,
    required: true
  },
  userId: {
    type: Types.ObjectId,
    required: true
  },
  isPublic: {
    type: Types.Boolean,
    default: false
  },
  ingredients: [ ingredientSchema ],
  steps: [ stepSchema ],
  imageId: {
    type: Types.String
  },
  rating: {
    type: Types.Number,
    default: 0,
    validator: ratingValidator
  }
});

module.exports = schema;