var mongoose = require('mongoose');

var RecipeSchema   = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number,
  userId: String
});

module.exports = mongoose.model('Recipe', RecipeSchema);