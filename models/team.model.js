const mongoose = require('mongoose');

const { Schema } = mongoose;

const teamSchema = new Schema({
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
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
  ],
});

const Team = mongoose.model('team', teamSchema);

export default Team;
