const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const categories = mongoose.model('categories', schema);

module.exports = categories;
