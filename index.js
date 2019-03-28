// ===================  3rd Party  ==================================
// Import all 3rd party packages
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ===================  Personal  ==================================
const characterRouter = require('./routes/api/characters');
const itemRouter = require('./routes/api/items');

// ===================  Initialize Router Variables  ==================================
// Initialize mongoose here.
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${
    process.env.DB
  }?retryWrites=true`,
  { useNewUrlParser: true }
);

// Initialize App
const app = express();

// ===================  Middleware Pipeline  ==================================

// HTTP request security
app.use(cors());
// For json body reading
app.use(express.json());
// For url form data
app.use(express.urlencoded({ extended: false }));
// static middleware
app.use(express.static(path.join(__dirname, 'public')));

// --------------------  Routing  ---------------------
app.use('/api/characters', characterRouter);
app.use('/api/items', itemRouter);

// ===================  Start Server  ==================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
