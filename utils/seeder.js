const FEStats = require('fire-emblem-heroes-stats');
const Character = require('../models/character.model');

const seeder = {
  insertAllCharacters: async () => {
    try {
      const apiHeroes = await FEStats.getAllHeroes();
      const characters = apiHeroes.map(hero => ({
        name: hero.shortName,
        title: hero.title,
        origin: hero.origin,
      }));
      return await Character.insertMany(characters);
    } catch (err) {
      throw err;
    }
  },
};

module.exports = seeder;
