var multiparty = require('multiparty');
var fs = require('fs');

var Recipe = require('../models/recipe');

var prepareForTransmit = function (dbEntry) {
    var recipe = {};
    recipe._id = dbEntry._id.toString();
    recipe.userId = dbEntry.userId.toString();
    recipe.title = dbEntry.title;
    recipe.isPublic = dbEntry.isPublic;
    recipe.ingredients = dbEntry.ingredients || [];
    recipe.rating = dbEntry.rating;

    if (dbEntry.image && dbEntry.image.data) {
        recipe.image = new Buffer(dbEntry.image.data, 'binary').toString('base64');
    }
    return recipe;
}

var extractFromRequest = function (req, callback) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var recipe = new Recipe();
        recipe.title = fields.title[0];
        recipe.isPublic = fields.isPublic[0];
        if (fields.rating && field.rating[0]) {
            recipe.rating = fields.rating[0];
        }
        recipe.userId = req.user._id;
        if (files.image) {
            recipe.image.data = fs.readFileSync(files.image[0].path);
            recipe.image.contentType = 'image/png';
        }

        callback(recipe);
    });
}

exports.getPublicRecipes = function (req, res) {
    Recipe.find({ isPublic: true }, function (err, recipes) {
        if (err)
            res.send(err);
        else {
            var response = [];
            recipes.forEach(function (recipe) {
                response.push(prepareForTransmit(recipe));
            });
            res.json(response);
        }
    });
};

exports.getPublicRecipe = function (req, res) {
    Recipe.findOne({ _id: req.params.recipe_id, isPublic: true }, function (err, recipe) {
        if (err)
            res.send(err);
        else
            res.json(prepareForTransmit(recipe));
    });
};

exports.getUserRecipes = function (req, res) {
    Recipe.find({ userId: req.user._id }, function (err, recipes) {
        if (err)
            res.send(err);
        else {
            var response = [];
            recipes.forEach(function (recipe) {
                response.push(prepareForTransmit(recipe));
            });
            res.json(response);
        }
    });
};

exports.getUserRecipe = function (req, res) {
    Recipe.findOne({ userId: req.user._id, _id: req.params.recipe_id }, function (err, recipe) {
        if (err)
            res.send(err);
        else
            res.json(prepareForTransmit(recipe));
    });
};

exports.postUserRecipe = function (req, res) {
    extractFromRequest(req, function (recipe) {
        recipe.save(function (err) {
            if (err)
                res.send(err);
            else
                res.json(prepareForTransmit(recipe));
        });
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

        extractFromRequest(req, function (recipe) {
            recipe.save();
            res.sendStatus(204);
        });
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