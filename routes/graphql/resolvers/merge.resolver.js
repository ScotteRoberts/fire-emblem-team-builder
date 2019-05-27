/* eslint-disable no-use-before-define */
const Character = require('../../../models/character.model');
const Team = require('../../../models/team.model');
const Category = require('../../../models/category.model');
const User = require('../../../models/user.model');

// ---------------------- Dynamic Data Relationships -----------------------
/* 
Helper functions to get information without populating data through mongoose.

These allow a recursive population of data on request when you drill down into queries.

If you didn't have this, it would end up populating an infinite loop or you would not get
nested data past the first level of population
*/

// Single Entries

const populateUser = async userId => {
  try {
    const user = await User.findById(userId);
    return transformUser(user);
  } catch (err) {
    throw err;
  }
};

// Many Entries

const populateTeams = async teamIds => {
  try {
    const teams = await Team.find({ _id: { $in: teamIds } });
    return teams.map(team => transformTeam(team));
  } catch (err) {
    throw err;
  }
};

const populateCharacters = async characterIds => {
  try {
    const characters = await Character.find({ _id: { $in: characterIds } });
    return characters.map(character => transformCharacter(character));
  } catch (err) {
    throw err;
  }
};

const populateCategories = async categoryIds => {
  try {
    const categories = await Category.find({ _id: { $in: categoryIds } });
    return categories.map(category => transformCategory(category));
  } catch (err) {
    throw err;
  }
};

// =================== Transformers ===================================
// TODO: Document!

const transformCharacter = category => ({ ...category._doc });

const transformCategory = category => ({
  ...category._doc,
  creator: populateUser.bind(this, category.creator),
});

const transformUser = user => ({
  ...user._doc,
  categories: populateCategories.bind(this, user._doc.categories),
  teams: populateTeams.bind(this, user._doc.teams),
});

const transformTeam = team => ({
  ...team._doc,
  roster: populateCharacters.bind(this, team._doc.roster),
  creator: populateUser.bind(this, team._doc.creator),
  categories: populateCategories.bind(this, team._doc.categories),
  createdAt: new Date(team._doc.createdAt).toISOString(),
  updatedAt: new Date(team._doc.updatedAt).toISOString(),
});

// =================== Exports ===================================

exports.transformCharacter = transformCharacter;
exports.transformCategory = transformCategory;
exports.transformUser = transformUser;
exports.transformTeam = transformTeam;
