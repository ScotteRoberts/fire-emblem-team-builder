const mongoose = require('mongoose');

const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    roster: [
      {
        type: Schema.Types.ObjectId,
        ref: 'character',
        required: true,
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'category',
      },
    ],
  },
  { timestamps: true }
);

const Team = mongoose.model('team', teamSchema);

module.exports = Team;
