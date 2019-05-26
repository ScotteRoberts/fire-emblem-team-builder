/* eslint-disable no-use-before-define */
const bcrypt = require('bcryptjs');
const Category = require('../../../models/category.model');
const User = require('../../../models/user.model');

// ---------------------- Dynamic Data Relationships -----------------------
/* 
Helper functions to get information without populating data through mongoose.

These allow a recursive population of data on request when you drill down into queries.

If you didn't have this, it would end up populating an infinite loop or you would not get
nested data past the first level of population
*/

const userPopulate = async userId => {
  try {
    const user = await User.findById(userId);
    console.log(user._doc);
    return {
      ...user._doc,
      createdCategories: categoriesPopulate.bind(this, user._doc.createdCategories),
    };
  } catch (err) {
    throw err;
  }
};

const categoriesPopulate = async categoryIds => {
  try {
    const categories = await Category.find({ _id: { $in: categoryIds } });
    return categories.map(category => ({
      ...category._doc,
      creator: userPopulate.bind(this, category.creator),
    }));
  } catch (err) {
    throw err;
  }
};

// ---------------------- Resolvers -----------------------

module.exports = {
  categories: async () => {
    try {
      const categories = await Category.find();
      return categories.map(category => ({
        ...category._doc,
        creator: userPopulate.bind(this, category._doc.creator), // ...manual population
      }));
    } catch (err) {
      throw err;
    }
  },
  createCategory: async args => {
    const category = new Category({
      name: args.categoryInput.name,
      description: args.categoryInput.description,
      creator: '5ceaf936f4f7555a790a0981',
    });
    let createdCategory;
    try {
      const result = await category.save();
      createdCategory = {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: userPopulate.bind(this, result._doc.creator),
      }; // mongodb specific thing: returns just the object, not the meta data associated.

      const creator = await User.findById('5ceaf936f4f7555a790a0981');
      if (!creator) {
        throw new Error('User was not found.');
      }
      console.log(creator.email);
      console.log(creator.createdCategories);
      creator.createdCategories.push(category);
      await creator.save();

      return createdCategory;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });

      if (existingUser) {
        throw new Error('User exists already.');
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        displayName: args.userInput.displayName,
      });
      const result = await user.save();

      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
};
