const Schema = require('mongoose').Schema;

const schema = new Schema({
  image: { data: Buffer, contentType: String }
});

module.exports = schema;