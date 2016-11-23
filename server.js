var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var router = require('./routes');
var config = require('./web.config');

mongoose.Promise = global.Promise;
mongoose.connect(config.databaseUrl);

var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/', router);

app.listen(port, function () {
  console.log("listening on port: " + port);
});