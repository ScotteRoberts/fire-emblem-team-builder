const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Category = mongoose.model('category', categorySchema);

module.exports = Category;
