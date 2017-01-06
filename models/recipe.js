var mongoose = require('mongoose');

var ratingValidator = [
    function (val) {
        return val >= 0 && val <= 5;
    },
    "rating should be between 0 and 5 stars"
];

var RecipeSchema = new mongoose.Schema({
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
    required: true
  },
  ingredients: {
    type: Array
  },
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

module.exports = mongoose.model('Recipe', RecipeSchema);