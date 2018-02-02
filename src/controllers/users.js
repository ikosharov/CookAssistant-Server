const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../../web.config');

exports.signUp = (req, res) => {
  const { username = '', password = '' } = req.body

  const user = new User({ username, password })

  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      const token = jwt.sign(user, config.tokenSecret);
      res.send({ token, id: user.id });
    }
  });
};

exports.signIn = (req, res) => {
  const { username = '', password = '' } = req.body

  User.findOne({ username }, (err, user) => {
    if (err || !user) {
      res.status(401).send({ message: 'invalid username or password' });
      return;
    }

    user.verifyPassword(password, (err, isMatch) => {
      if (err || !isMatch) {
        res.status(401).send({ message: 'invalid username or password' });
        return;
      }

      const token = jwt.sign(user, config.tokenSecret);
      res.send({ token, id: user.id });
    });
  });
}

exports.userInfo = (req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err)
      res.send(err);

    res.json(user);
  });
}