var Schema = require('mongoose').Schema;

var schema = new Schema({
    title: { type: String, required: true},
    image: { data: Buffer, contentType: String }
});

module.exports = schema;