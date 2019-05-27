const Category = require('../../../models/category.model');
const User = require('../../../models/user.model');

const { transformCategory } = require('./merge.resolver');

// ---------------------- Resolvers -----------------------
module.exports = {
  categories: async () => {
    try {
      const categories = await Category.find();
      return categories.map(category => transformCategory(category));
    } catch (err) {
      throw err;
    }
  },
  createCategory: async args => {
    const category = new Category({
      name: args.categoryInput.name,
      description: args.categoryInput.description,
      creator: '5ceb322e95aa236e3be751d0',
    });
    let createdCategory;
    try {
      const result = await category.save();
      createdCategory = transformCategory(result);

      const creator = await User.findById('5ceb322e95aa236e3be751d0');
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
