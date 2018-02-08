const Schema = require('mongoose').Schema;
const Types = Schema.Types

const schema = new Schema({
  image: { data: Types.Buffer, contentType: String }
});

module.exports = schema;