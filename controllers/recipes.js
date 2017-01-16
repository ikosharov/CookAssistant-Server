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

var extractFromRequest = function (req, dbEntry, callback) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var recipe = (dbEntry != null) ? dbEntry : new Recipe();
        recipe.userId = req.user._id;

        if (fields.title && fields.title[0]) {
            recipe.title = fields.title[0];
        }
        if (fields.isPublic) {
            recipe.isPublic = fields.isPublic[0];
        }
        if (fields.rating && fields.rating[0]) {
            recipe.rating = fields.rating[0];
        }
        if (files.image) {
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
    if (req.query.visibility != 'public' && req.query.user != 'current') {
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
                response.push(prepareForTransmit(recipe));
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
            res.json(prepareForTransmit(recipe));
        }
    });
};

exports.postRecipe = function (req, res) {
    extractFromRequest(req, null, function (recipe) {
        recipe.save(function (err) {
            if (err)
                res.send(err);
            else
                res.json(prepareForTransmit(recipe));
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

        extractFromRequest(req, dbEntry, function (recipe) {
            recipe.save();
            res.sendStatus(204);
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