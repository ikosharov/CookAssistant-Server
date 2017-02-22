var multiparty = require('multiparty');
var fs = require('fs');

var Recipe = require('../models/recipe');
var Ingredient = require('../models/ingredient');
var prepareIngredientForTransmit = require('./ingredients').prepareIngredientForTransmit;
var prepareStepForTransmit = require('./steps').prepareStepForTransmit;

var Step = require('../models/step');

// all details
var prepareRecipeDetailsForTransmit = function (dbEntry) {
    var dataToTransmit = {};
    dataToTransmit._id = dbEntry._id.toString();
    dataToTransmit.userId = dbEntry.userId.toString();
    dataToTransmit.title = dbEntry.title;
    dataToTransmit.isPublic = dbEntry.isPublic;
    dataToTransmit.rating = dbEntry.rating;

    dataToTransmit.ingredients = [];
    if (dbEntry.ingredients) {
        dbEntry.ingredients.forEach(function (ingredient) {
            dataToTransmit.ingredients.push(prepareIngredientForTransmit(ingredient));
        });
    }
    dataToTransmit.steps = [];
    if (dbEntry.steps) {
        dbEntry.steps.forEach(function (step) {
            dataToTransmit.steps.push(prepareStepForTransmit(step));
        });
    }

    if (dbEntry.image && dbEntry.image.data) {
        dataToTransmit.image = new Buffer(dbEntry.image.data, 'binary').toString('base64');
    }
    return dataToTransmit;
}

// no ingredients, steps to prepare and their images
var prepareRecipeSummaryForTransmit = function (dbEntry) {
    var dataToTransmit = {};
    dataToTransmit._id = dbEntry._id.toString();
    dataToTransmit.userId = dbEntry.userId.toString();
    dataToTransmit.title = dbEntry.title;
    dataToTransmit.isPublic = dbEntry.isPublic;
    dataToTransmit.rating = dbEntry.rating;

    if (dbEntry.image && dbEntry.image.data) {
        dataToTransmit.image = new Buffer(dbEntry.image.data, 'binary').toString('base64');
    }
    return dataToTransmit;
}

var extractRecipeFromRequest = function (req, dbEntry, callback) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var recipe = (dbEntry != null) ? dbEntry : new Recipe();
        recipe.userId = req.user._id;

        var recipeFromRequest = JSON.parse(fields.data);

        if (typeof recipeFromRequest.title != 'undefined') {
            recipe.title = recipeFromRequest.title;
        }
        if (typeof recipeFromRequest.isPublic != 'undefined') {
            recipe.isPublic = recipeFromRequest.isPublic;
        }
        if (typeof recipeFromRequest.rating != 'undefined') {
            recipe.rating = recipeFromRequest.rating;
        }
        if (typeof files.image != 'undefined') {
            recipe.image.data = fs.readFileSync(files.image[0].path);
            recipe.image.contentType = 'image/png';
        }

        callback(recipe);
    });
}

exports.getRecipes = function (req, res) {
    var filter = {};
    if (req.query.visibility) {
        filter.isPublic = req.query.visibility == 'public';
    }
    if (req.query.user == 'current') {
        filter.userId = req.user._id;
    }
    if (req.query.visibility != 'public' && typeof req.query.visibility != 'undefined' &&
        req.query.user != 'current' && typeof req.query.user != 'undefined') {
        // not allowed to request non-public recipes of other users
        res.sendStatus(401);
        return;
    }

    Recipe.find(filter, function (err, recipes) {
        if (err)
            res.send(err);
        else {
            var response = [];
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

            if (!recipe.isPublic && recipe.userId != req.user._id) {
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

        if (dbEntry.userId != req.user._id) {
            res.sendStatus(401);
            return;
        }

        extractRecipeFromRequest(req, dbEntry, function (recipe) {
            recipe.save(function (err) {
                if (err)
                    send(err);
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

        if (recipe.userId != req.user._id) {
            res.sendStatus(401);
            return;
        }

        recipe.remove();
        res.sendStatus(204);
    });
};