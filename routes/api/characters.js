const express = require('express');
const FEStats = require('fire-emblem-heroes-stats');
const Character = require('../../models/character.model');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const characters = await Character.find();
    const heroes = FEStats.getAllHeroes();
    res.json({ characters });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
