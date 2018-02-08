const Recipe = require('../models/recipe');
const prepareIngredientForTransmit = require('./ingredients').prepareIngredientForTransmit;
const prepareStepForTransmit = require('./steps').prepareStepForTransmit;
const isEqual = require('lodash').isEqual

const prepareRecipeDetailsForTransmit = function (dbEntry) {
  return {
    _id: dbEntry._id.toString(),
    userId: dbEntry.userId.toString(),
    title: dbEntry.title,
    isPublic: dbEntry.isPublic,
    rating: dbEntry.rating,
    ingredients: dbEntry.ingredients.map(i => prepareIngredientForTransmit(i)),
    steps: dbEntry.steps.map(s => prepareStepForTransmit(s)),
    image_id: dbEntry.image_id
  }
}

const prepareRecipeSummaryForTransmit = function (dbEntry) {
  return {
    _id: dbEntry._id.toString(),
    userId: dbEntry.userId.toString(),
    title: dbEntry.title,
    isPublic: dbEntry.isPublic,
    rating: dbEntry.rating,
    image_id: dbEntry.image_id
  }
}

const extractRecipeFromRequest = function (req, dbEntry, callback) {
  let recipe = (dbEntry != null) ? dbEntry : new Recipe();
  recipe.userId = req.user._id;
  callback(Object.assign(recipe, req.body))
}

exports.getRecipes = function (req, res) {
  const filter = {};
  if (req.query.visibility) {
    filter.isPublic = req.query.visibility === 'public';
  }
  if (req.query.user === 'current') {
    filter.userId = req.user._id;
  }
  if (req.query.visibility !== 'public' && typeof req.query.visibility !== 'undefined' &&
      req.query.user !== 'current' && typeof req.query.user !== 'undefined') {
      // not allowed to request non-public recipes of other users
    res.sendStatus(401);
    return;
  }

  Recipe.find(filter, function (err, recipes) {
    if (err)
      res.send(err);
    else {
      const response = [];
      recipes.forEach(function (recipe) {
        response.push(prepareRecipeSummaryForTransmit(recipe));
      });
      res.json(response);
    }
  });
};

exports.getRecipe = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, recipe) {
    if (err) {
      res.send(err);
    } else {

      if (!recipe.isPublic && !isEqual(recipe.userId, req.user._id)) {
        // not allowed to request non-public recipes of other users
        res.sendStatus(401);
        return;
      }
      res.json(prepareRecipeDetailsForTransmit(recipe));
    }
  });
};

exports.postRecipe = function (req, res) {
  extractRecipeFromRequest(req, null, function (recipe) {
    recipe.save(function (err) {
      if (err)
        res.send(err);
      else
        res.json(prepareRecipeDetailsForTransmit(recipe));
    });
  });
};

exports.putRecipe = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, dbEntry) {
    if (err) {
      res.send(err);
      return;
    }

    if (!dbEntry) {
      res.sendStatus(404);
      return;
    }

    if (!isEqual(dbEntry.userId, req.user._id)) {
      res.sendStatus(401);
      return;
    }

    extractRecipeFromRequest(req, dbEntry, function (recipe) {
      recipe.save(function (err) {
        if (err)
          res.send(err);
        else
          res.sendStatus(204);
      });
    });
  });
};

exports.deleteRecipe = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, recipe) {
    if (err) {
      res.send(err);
      return;
    }

    if (!recipe) {
      res.sendStatus(404);
      return;
    }

    if (!isEqual(recipe.userId, req.user._id)) {
      res.sendStatus(401);
      return;
    }

    recipe.remove(function (err) {
      if (err)
        res.send(err);
      else
        res.sendStatus(204);
    });
  });
};