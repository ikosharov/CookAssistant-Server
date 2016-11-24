var Recipe = require('../models/recipe');

exports.getPublicRecipes = function (req, res) {
  Recipe.find({ public: true }, function (err, recipes) {
    if (err)
      res.send(err);
    else
      res.json(recipes);
  });
};

exports.getPublicRecipe = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id, public: true }, function (err, recipe) {
    if (err)
      res.send(err);
    else
      res.json(recipe);
  });
};

exports.getUserRecipes = function (req, res) {
  Recipe.find({ userId: req.user._id }, function (err, recipes) {
    if (err)
      res.send(err);
    else
      res.json(recipes);
  });
};

exports.getUserRecipe = function (req, res) {
  Recipe.findOne({ userId: req.user._id, _id: req.params.recipe_id }, function (err, recipe) {
    if (err)
      res.send(err);
    else
      res.json(recipe);
  });
};

exports.postUserRecipe = function (req, res) {
  var recipe = new Recipe();
  recipe.title = req.body.title;
  recipe.public = req.body.public;
  recipe.userId = req.user._id;

  recipe.save(function (err) {
    if (err)
      res.send(err);
    else
      res.json(recipe);
  });
};

exports.putUserRecipe = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, recipe) {
    if (err) {
      res.send(err);
      return;
    }

    if (!recipe) {
      res.sendStatus(404);
      return;
    }

    if (recipe.userId != req.user._id) {
      res.sendStatus(401);
      return;
    }

    recipe.title = req.body.title;
    recipe.public = req.body.public;
    recipe.save();
    res.sendStatus(204);
  });
};

exports.deleteUserRecipe = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, recipe) {
    if (err) {
      res.send(err);
      return;
    }

    if (!recipe) {
      res.sendStatus(404);
      return;
    }

    if (recipe.userId != req.user._id) {
      res.sendStatus(401);
      return;
    }

    recipe.remove();
    res.sendStatus(204);
  });
};