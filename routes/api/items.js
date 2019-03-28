const express = require('express');
const mongoose = require('mongoose');

const csv = require('csvtojson');

const itemsPath = 'assets/all-items.csv';

const Item = require('../../models/item.model');

const itemRouter = express.Router();

itemRouter.get('/', async (req, res) => {
  const items = await csv().fromFile(itemsPath);
  res.json({ items });
});

module.exports = itemRouter;
