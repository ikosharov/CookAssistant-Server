const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// validators
const usernameValidator = [
  function (val) {
    return val.length >= 1;
  },
  "username should be at least 1 characters"
];

const passwordValidator = [
  function (val) {
    return val.length >= 1;
  },
  "password should be at least 1 characters"
];

// Define our user schema
const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    validate: usernameValidator
  },
  password: {
    type: String,
    required: true,
    validator: passwordValidator
  }
});

// Execute before each user.save() call
schema.pre('save', function (callback) {
  const user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

schema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = schema;