const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  title: String,
  origin: String,
});

const Character = mongoose.model('character', schema);

module.exports = Character;
