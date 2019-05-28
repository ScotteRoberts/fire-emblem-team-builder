const mongoose = require('mongoose');

const { Schema } = mongoose;

const characterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  origin: { type: String },
  title: { type: String },
  // portraits: {
  //   px75: {},
  //   px113: {},
  //   px150: {},
  // },
});

// TODO: Look into indexing later.
// characterSchema.index({ name: 1, origin: 1 }, { unique: true });

const Character = mongoose.model('character', characterSchema);

module.exports = Character;
