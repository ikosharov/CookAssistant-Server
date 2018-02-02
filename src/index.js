const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes');
const config = require('../web.config');

mongoose.Promise = global.Promise;
mongoose.connect(config.databaseUrl);

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/', router);

app.listen(port, function () {
  console.log("listening on port: " + port);
});