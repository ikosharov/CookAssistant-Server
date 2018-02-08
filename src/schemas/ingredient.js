const Schema = require('mongoose').Schema;
const Types = Schema.Types

const schema = new Schema({
  title: { type: Types.String, required: true},
  image: { data: Types.Buffer, contentType: String }
});

module.exports = schema;