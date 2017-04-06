var jwt = require('jsonwebtoken');

var User = require('../models/user');
var config = require('../web.config');

exports.signUp = function (req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  var user = new User({
    username: username,
    password: password
  });

  user.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      var token = jwt.sign(user, config.tokenSecret);

      res.send({ token: token, id: user.id });
    }
  });
};

exports.signIn = function (req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  User.findOne({ username: username }, function (err, user) {
    if (err || !user) {
      res.status(401).send({ message: 'invalid username or password' });
      return;
    }

    user.verifyPassword(password, function (err, isMatch) {
      if (err || !isMatch) {
        res.status(401).send({ message: 'invalid username or password' });
        return;
      }

      var token = jwt.sign(user, config.tokenSecret);
      res.send({ token: token, id: user.id });
    });
  });
}

exports.userInfo = function (req, res) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err)
      res.send(err);

    res.json(user);
  });
}