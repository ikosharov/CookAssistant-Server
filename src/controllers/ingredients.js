const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const isEqual = require('lodash').isEqual

const extractIngredientFromRequest = function (req, dbEntry, callback) {
  const ingredient = (dbEntry != null) ? dbEntry : new Ingredient();
  callback(Object.assign(ingredient, req.body))
}

const prepareIngredientForTransmit = function (dbEntry) {
  return {
    _id: dbEntry._id.toString(),
    title: dbEntry.title,
    imageId: dbEntry.imageId
  };
}

exports.prepareIngredientForTransmit = prepareIngredientForTransmit;

exports.postIngredient = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, dbEntryRecipe) {
    if (err) {
      res.send(err);
      return;
    }

    if (!dbEntryRecipe) {
      res.sendStatus(404);
      return;
    }

    if (!isEqual(dbEntryRecipe.userId, req.user._id)) {
      res.sendStatus(401);
      return;
    }

    extractIngredientFromRequest(req, null, function (ingredient) {
      dbEntryRecipe.ingredients.push(ingredient);
      dbEntryRecipe.save(function (err) {
        if (err)
          res.send(err);
        else
          res.json(prepareIngredientForTransmit(ingredient));
      });
    });
  });
};

exports.putIngredient = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, dbEntryRecipe) {
    if (err) {
      res.send(err);
      return;
    }

    if (!dbEntryRecipe) {
      res.sendStatus(404);
      return;
    }

    if (!isEqual(dbEntryRecipe.userId, req.user._id)) {
      res.sendStatus(401);
      return;
    }

    const dbEntryIngredient = dbEntryRecipe.ingredients.find((element) => element._id.toString() === req.params.ingredient_id);

    if (!dbEntryIngredient) {
      res.sendStatus(404);
      return;
    }

    extractIngredientFromRequest(req, dbEntryIngredient, function (ingredient) {
      ingredient.save(function (err) {
        if (err)
          res.send(err);
        else
          dbEntryRecipe.save(function (err) {
            if (err)
              res.send(err);
            else
              res.send(prepareIngredientForTransmit(ingredient));
          });
        });
      });
  });
};

exports.deleteIngredient = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, dbEntryRecipe) {
    if (err) {
      res.send(err);
      return;
    }

    if (!dbEntryRecipe) {
      res.sendStatus(404);
      return;
    }

    if (!isEqual(dbEntryRecipe.userId, req.user._id)) {
      res.sendStatus(401);
      return;
    }

    const dbEntryIngredient = dbEntryRecipe.ingredients.find((element) => element._id.toString() === req.params.ingredient_id);

    if (!dbEntryIngredient) {
      res.sendStatus(404);
      return;
    }

    dbEntryIngredient.remove(function (err) {
      if (err)
        res.send(err)
      else
        dbEntryRecipe.save(function (err) {
          if (err)
            res.send(err);
          else
            res.sendStatus(204);
        });
    });
  });
};