const multiparty = require('multiparty');
const fs = require('fs');

const Recipe = require('../models/recipe');
const Step = require('../models/step');

const extractStepFromRequest = (req, dbEntry, callback) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    const step = (dbEntry != null) ? dbEntry : new Step();

    const stepFromRequest = JSON.parse(fields.data);

      if (typeof stepFromRequest.title !== 'undefined') {
        step.title = stepFromRequest.title;
      }

      if (typeof files.image !== 'undefined') {
        step.image.data = fs.readFileSync(files.image[0].path);
        step.image.contentType = 'image/png';
      }

      callback(step);
  });
}

const prepareStepForTransmit = function (dbEntry) {
  const dataToTransmit = {};
  dataToTransmit._id = dbEntry._id.toString();
  dataToTransmit.title = dbEntry.title;

  if (dbEntry.image && dbEntry.image.data) {
    dataToTransmit.image = new Buffer(dbEntry.image.data, 'binary').toString('base64');
  }
  return dataToTransmit;
}

exports.prepareStepForTransmit = prepareStepForTransmit;

exports.postStep = function (req, res) {
  Recipe.findOne({ _id: req.params.recipe_id }, function (err, dbEntryRecipe) {
    if (err) {
      res.send(err);
      return;
    }

    if (!dbEntryRecipe) {
      res.sendStatus(404);
      return;
    }

    if (dbEntryRecipe.userId !== req.user._id) {
      res.sendStatus(401);
      return;
    }

    extractStepFromRequest(req, null, function (step) {
      dbEntryRecipe.steps.push(step);
      dbEntryRecipe.save(function (err) {
        if (err)
          res.send(err);
        else
          res.json(prepareStepForTransmit(step));
      });
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

    if (dbEntryRecipe.userId !== req.user._id) {
      res.sendStatus(401);
      return;
    }

    const dbEntryStep = dbEntryRecipe.steps.find((element) => element._id === req.params.step_id);

    if (!dbEntryStep) {
      res.sendStatus(404);
      return;
    }

    extractStepFromRequest(req, dbEntryStep, function (step) {
      step.save(function (err) {
        if (err)
          res.send(err);
        else
          dbEntryRecipe.save(function (err) {
            if (err)
              res.send(err);
            else
              res.send(prepareStepForTransmit(step));
          });
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

    if (dbEntryRecipe.userId !== req.user._id) {
      res.sendStatus(401);
      return;
    }

    const dbEntryStep = dbEntryRecipe.steps.find((element) => element._id === req.params.step_id);

    if (!dbEntryStep) {
      res.sendStatus(404);
      return;
    }

    dbEntryStep.remove(function (err) {
      if (err)
        res.send(err);
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