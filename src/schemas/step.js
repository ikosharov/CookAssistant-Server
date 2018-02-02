const Schema = require('mongoose').Schema;

const schema = new Schema({
  title: { type: String, required: true},
  image: { data: Buffer, contentType: String }
});

module.exports = schema;