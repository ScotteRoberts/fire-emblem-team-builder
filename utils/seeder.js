const FEStats = require('fire-emblem-heroes-stats');
const Character = require('../models/character.model');

const seeder = {
  getEverything: async () => {
    try {
      const apiHeroes = await FEStats.getAllHeroes();
      return apiHeroes;
    } catch (err) {
      throw err;
    }
  },
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
  getAssets: async () => {
    try {
      const apiHeroes = await FEStats.getAllHeroes();
      const characterPhotos = apiHeroes.map(hero => ({
        name: hero.name,
        assets: hero.assets.portrait,
      }));
      return characterPhotos;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = seeder;
