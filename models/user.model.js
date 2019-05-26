const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
  },
  createdCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
  ],
});

const user = mongoose.model('user', userSchema);

module.exports = user;
