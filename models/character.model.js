const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: { type: String, require: true },
  origin: { type: String, require: true },
  title: String,
});

const Character = mongoose.model('character', schema);

module.exports = Character;
