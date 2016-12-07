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
  public: {
    type: Boolean,
    require: true
  },
  ingredients: {
    type: Array
  },
  image: { 
    data: Buffer
  },
  rating: {
    type: Number
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);