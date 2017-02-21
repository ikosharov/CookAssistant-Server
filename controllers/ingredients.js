var multiparty = require('multiparty');
var fs = require('fs');

var Recipe = require('../models/recipe');
var Ingredient = require('../models/ingredient');

var extractIngredientFromRequest = function (req, dbEntry, callback) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var ingredient = (dbEntry != null) ? dbEntry : new Ingredient();

        var ingredientFromRequest = JSON.parse(fields.data);

        if (typeof ingredientFromRequest.title != 'undefined') {
            ingredient.title = ingredientFromRequest.title;
        }

        if (typeof files.image != 'undefined') {
            ingredient.image.data = fs.readFileSync(files.image[0].path);
            ingredient.image.contentType = 'image/png';
        }

        callback(ingredient);
    });
}

var prepareIngredientForTransmit = function (dbEntry) {
    var dataToTransmit = {};
    dataToTransmit._id = dbEntry._id.toString();
    dataToTransmit.title = dbEntry.title;

    if (dbEntry.image && dbEntry.image.data) {
        dataToTransmit.image = new Buffer(dbEntry.image.data, 'binary').toString('base64');
    }
    return dataToTransmit;
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

        if (dbEntryRecipe.userId != req.user._id) {
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

        if (dbEntryRecipe.userId != req.user._id) {
            res.sendStatus(401);
            return;
        }

        var dbEntryIngredient = dbEntryRecipe.ingredients.find((element) => element._id == req.params.ingredient_id);

        if (!dbEntryIngredient) {
            res.sendStatus(404);
            return;
        }

        extractIngredientFromRequest(req, dbEntryIngredient, function (ingredient) {
            ingredient.save();
            res.sendStatus(204);
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

        if (dbEntryRecipe.userId != req.user._id) {
            res.sendStatus(401);
            return;
        }


        var dbEntryIngredient = dbEntryRecipe.ingredients.find((element) => element._id == req.params.ingredient_id);

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