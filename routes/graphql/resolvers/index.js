const authResolver = require('./auth.resolver');
const categoryResolver = require('./category.resolver');
const characterResolver = require('./character.resolver');
const teamResolver = require('./team.resolver');

module.exports = {
  ...authResolver,
  ...categoryResolver,
  ...characterResolver,
  ...teamResolver,
};
