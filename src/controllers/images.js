const multiparty = require('multiparty');
const fs = require('fs');

const Image = require('../models/image');

const extractImageFromRequest = function (req, callback) {
  const form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    const image = new Image();
    image.image.data = fs.readFileSync(files.image[0].path);
    image.image.contentType = 'image/png';
    callback(image);
  });
}


exports.getImage = function (req, res) {
  const { image_id } = req.params
  if (image_id === 'undefined') {
    res.sendStatus(404);
    return;
  }

  Image.findOne({ _id: image_id }, function (err, image) {
    if (err) {
      res.send(err);
    } else {
      res.contentType('png')
      res.end(image.image.data)
    }
  });
};

exports.postImage = function (req, res) {
  extractImageFromRequest(req, function (image) {
    image.save(function (err) {
      if (err)
        res.send(err);
      else
        res.json({ id: image._id.toString() });
    });
  });
};