var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// validators
var usernameValidator = [
    function (val) {
        return val.length >= 4;
    },
    "username should be at least 4 characters"
];

var passwordValidator = [
    function (val) {
        return val.length >= 4;
    },
    "password should be at least 4 characters"
];

// Define our user schema
var schema = new mongoose.Schema({
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
    var user = this;

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