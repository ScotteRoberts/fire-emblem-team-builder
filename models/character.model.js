const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
});

const Character = mongoose.model('character', schema);

module.exports = Character;
