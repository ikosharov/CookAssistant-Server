const Schema = require('mongoose').Schema;
const Types = Schema.Types;

const schema = new Schema({
  title: { type: Types.String, required: true},
  imageId: { type: Types.String }
});

module.exports = schema;