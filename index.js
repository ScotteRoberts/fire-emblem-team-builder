// ===================  3rd Party  ==================================
// Import all 3rd party packages
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ===================  Personal  ==================================
const characterRouter = require('./routes/api/characters');
const itemRouter = require('./routes/api/items');
const Category = require('./models/category.model');
const User = require('./models/user.model');

// ===================  Initialize Variables  ==================================

// Initialize App
const app = express();

// Determine port
const PORT = process.env.PORT || 4000;

// Helper function to get users without populating data.
const user = userId =>
  User.findById(userId)
    .then(userResult => ({ ...userResult._doc }))
    .catch(err => {
      throw err;
    });

const categories = categoryIds =>
  Category.find({ _id: { $in: categoryIds } })
    .then(categoryList =>
      categoryList.map(category => ({
        ...category._doc,
        creator: user.bind(this, category.creator),
      }))
    )
    .catch(err => {
      throw err;
    });

// ===================  Middleware Pipeline  ==================================

// HTTP request security
app.use(cors());
// For json body reading
app.use(bodyParser.json());
// For url form data
app.use(express.urlencoded({ extended: false }));
// static middleware
app.use(express.static(path.join(__dirname, 'public')));

// --------------------  GraphQL Routing  ---------------------

// graphql middleware: takes requests and forwards them to the appropriate resolvers
app.use(
  '/graphql',
  graphqlHttp({
    // ORM: Performs heavy lifting of converting template literal strings to javascript objects
    schema: buildSchema(`
      type Character {
        _id: ID!
        name: String!
        origin: String
        title: String
      }

      type Category {
        _id: ID!
        name: String!
        description: String
        creator: User!
      }

      input CategoryInput {
        name: String!
        description: String
      }

      type User {
        _id: ID!
        email: String!
        password: String!
        displayName: String
        createdCategories: [Category!]
      }

      input UserInput {
        email: String!
        password: String!
        displayName: String
      }

      type RootQuery {
        categories: [Category!]!
        characters: [Character!]!
      }

      type RootMutation {
        createCategory(categoryInput: CategoryInput): Category
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    // Resolvers: Correlates one-for-one with the above query and mutation names. Executes the logic when
    // a graphql query enters the server.
    rootValue: {
      categories: () =>
        Category.find()
          .then(categories =>
            categories.map(category => ({
              ...category._doc,
              creator: user.bind(this, category._doc.creator), // A little confusing... manual population
            }))
          )
          .catch(err => {
            console.log(err);
            throw err;
          }),
      createCategory: args => {
        const category = new Category({
          name: args.categoryInput.name,
          description: args.categoryInput.description,
          creator: '5cead32d9897b94bc8b3f16e',
        });
        let createdCategory;
        return category
          .save()
          .then(result => {
            createdCategory = { ...result._doc }; // mongodb specific thing: returns just the object, not the meta data associated.
            return User.findById('5cead32d9897b94bc8b3f16e');
          })
          .then(user => {
            if (!user) {
              throw new Error('User was not found.');
            }
            user.createdCategories.push(category);
            return user.save();
          })
          .then(result => createdCategory)
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createUser: args =>
        User.findOne({ email: args.userInput.email })
          .then(user => {
            if (user) {
              throw new Error('User exists already.');
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
              displayName: args.userInput.displayName,
            });
            return user.save();
          })
          .then(result => ({ ...result._doc, password: null }))
          .catch(err => {
            throw err;
          }),
    },
    // Visual Interface: allows you to play with graphql queries. Shipped with express-graphql
    graphiql: true,
  })
);

// --------------------  REST Routing  ---------------------

app.use('/api/characters', characterRouter);
app.use('/api/items', itemRouter);

// ===================  Start Server  ==================================

// Initialize mongoose connection.
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${
      process.env.DB
    }?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    // Start the server, if successful.
    app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });
