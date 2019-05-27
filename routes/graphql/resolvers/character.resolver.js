const Character = require('../../../models/character.model');
const { transformCharacter } = require('./merge.resolver');

// ---------------------- Resolvers -----------------------

module.exports = {
  characters: async () => {
    try {
      const characters = await Character.find();
      return characters.map(character => transformCharacter(character));
    } catch (err) {
      throw err;
    }
  },
};
