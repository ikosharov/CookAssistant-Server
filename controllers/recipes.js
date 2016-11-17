var Recipe = require('../models/recipe');

exports.postRecipe = function (req, res) {
  var recipe = new Recipe();
  recipe.title = req.body.title;
  recipe.userId = req.user._id;

  recipe.save(function (err) {
    if (err)
      res.send(err);

    res.json(recipe);
  });
};

exports.getRecipes = function (req, res) {
  Recipe.find({ userId: req.user._id }, function (err, recipes) {
    if (err)
      res.send(err);

    res.json(recipes);
  });
};

exports.getRecipe = function (req, res) {
  Recipe.find({ userId: req.user._id, _id: req.params.recipe_id }, function (err, recipe) {
    if (err)
      res.send(err);

    res.json(recipe);
  });
};

exports.putRecipe = function (req, res) {
  Recipe.update({ userId: req.user._id, _id: req.params.recipe_id }, { title: req.body.title }, function (err, num, raw) {
    if (err)
      res.send(err);

    res.json({ message: num + ' updated' });
  });
};

exports.deleteRecipe = function (req, res) {
  Recipe.remove({ userId: req.user._id, _id: req.params.recipe_id }, function (err) {
    if (err)
      res.send(err);

    res.sendStatus(204);
  });
};