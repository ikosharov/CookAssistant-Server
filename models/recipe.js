var mongoose = require('mongoose');

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
    type: Number
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);