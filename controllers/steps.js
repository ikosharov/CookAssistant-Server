var multiparty = require('multiparty');
var fs = require('fs');

var Recipe = require('../models/recipe');
var Step = require('../models/step');

var extractStepFromRequest = function (req, dbEntry, callback) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var step = (dbEntry != null) ? dbEntry : new Step();

        var stepFromRequest = JSON.parse(fields.data);

        if (typeof stepFromRequest.title != 'undefined') {
            step.title = stepFromRequest.title;
        }
      
        if (typeof files.image != 'undefined') {
            step.image.data = fs.readFileSync(files.image[0].path);
            step.image.contentType = 'image/png';
        }

        callback(step);
    });
}

var prepareStepForTransmit = function (dbEntry) {
    var dataToTransmit = {};
    dataToTransmit._id = dbEntry._id.toString();
    dataToTransmit.title = dbEntry.title;

    if (dbEntry.image && dbEntry.image.data) {
        dataToTransmit.image = new Buffer(dbEntry.image.data, 'binary').toString('base64');
    }
    return dataToTransmit;
}

exports.postStep = function (req, res) {
    extractStepFromRequest(req, null, function (step) {
        step.save(function (err) {
            if (err)
                res.send(err);
            else
                res.json(prepareStepForTransmit(step));
        });
    });
};

exports.putStep = function (req, res) {
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

        dbEntryRecipe.findOne({_id: req.params.step_id}, function(err, dbEntryStep) {
            if (err) {
                res.send(err);
                return;
            }

            if (!dbEntryStep) {
                res.sendStatus(404);
                return;
            }

            extractStepFromRequest(req, dbEntryStep, function (step) {
                step.save();
                res.sendStatus(204);
            });
        });
    });
};

exports.deleteStep = function (req, res) {
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


        dbEntryRecipe.findOne({_id: req.params.step_id}, function(err, dbEntryStep) {
            if (err) {
                res.send(err);
                return;
            }

            if (!dbEntryStep) {
                res.sendStatus(404);
                return;
            }

            dbEntryStep.remove();
            res.sendStatus(204);
        });
    });
};