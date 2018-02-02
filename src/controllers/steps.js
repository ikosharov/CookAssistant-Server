const Recipe = require('../models/recipe');
const Step = require('../models/step');

const extractStepFromRequest = (req, dbEntry, callback) => {
  const step = (dbEntry != null) ? dbEntry : new Step();
  const stepFromRequest = JSON.parse(req.body);
  callback({...step, ...stepFromRequest});
}

const prepareStepForTransmit = function (dbEntry) {
  return {
    _id: dbEntry._id.toString(),
    title: dbEntry.title,
    image_id: dbEntry.image_id
  };
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