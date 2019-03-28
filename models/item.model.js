const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
});

const Item = mongoose.model('item', schema);

module.exports = Item;
