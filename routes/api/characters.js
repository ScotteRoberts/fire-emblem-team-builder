const express = require('express');
const csv = require('csvtojson');
const Character = require('../../models/character.model');
const seeder = require('../../utils/seeder');

const fe7FilePath = 'assets/fe7.csv';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const characters = await Character.find();
    return res.json({ characters });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/seed', async (req, res) => {
  try {
    await Character.deleteMany({});
    const characters = await seeder.insertAllCharacters();
    return res.status(201).json({ message: 'All Characters Seeded', characters });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get('/things', async (req, res) => {
  try {
    const response = await csv().fromFile(fe7FilePath);
    return res.json({ response });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
