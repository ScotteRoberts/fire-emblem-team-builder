const Category = require('../../../models/category.model');
const User = require('../../../models/user.model');

const { transformCategory } = require('./merge.resolver');

// ---------------------- Resolvers -----------------------
module.exports = {
  categories: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const categories = await Category.find();
      return categories.map(category => transformCategory(category));
    } catch (err) {
      throw err;
    }
  },
  createCategory: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    const category = new Category({
      name: args.categoryInput.name,
      description: args.categoryInput.description,
      creator: req.userId,
    });
    let createdCategory;
    try {
      const result = await category.save();
      createdCategory = transformCategory(result);

      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User was not found.');
      }
      creator.createdCategories.push(category);
      await creator.save();

      return createdCategory;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
