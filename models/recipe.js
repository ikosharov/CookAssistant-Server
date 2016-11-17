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
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);