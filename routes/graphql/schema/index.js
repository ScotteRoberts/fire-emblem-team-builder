const { buildSchema } = require('graphql');

module.exports = buildSchema(`
      type Category {
        _id: ID!
        name: String!
        description: String
        creator: User!
      }
      
      type User {
        _id: ID!
        email: String!
        password: String
        displayName: String
        createdCategories: [Category!]
      }
      
      input CategoryInput {
        name: String!
        description: String
      }

      input UserInput {
        email: String!
        password: String!
        displayName: String
      }

      type RootQuery {
        categories: [Category!]!
      }

      type RootMutation {
        createCategory(categoryInput: CategoryInput): Category
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `);
