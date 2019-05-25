const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: { type: String, required: true },
  origin: { type: String },
  title: { type: String },
});

const Character = mongoose.model('character', schema);

module.exports = Character;
