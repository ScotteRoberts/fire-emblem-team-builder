const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Character {
    _id: ID!
    name: String!
    origin: String
    title: String
  }

  type Team {
    _id: ID!
    name: String!
    roster: [Character!]!
    creator: User!
    categories: [Category!]
    createdAt: String!
    updatedAt: String!
  }  

  type Category {
    _id: ID!
    name: String!
    description: String
    creator: User!
  }
  
  type User {
    _id: ID!
    email: String!
    password: String!
    displayName: String
    createdCategories: [Category!]
    createdTeams: [Team!]
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input CharacterInput {
    name: String!
    origin: String
    title: String
  }

  input TeamInput {
    name: String!
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
    characters: [Character!]!
    teams: [Team!]!
    categories: [Category!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createCategory(categoryInput: CategoryInput): Category
    deleteCategory(categoryId: ID!): Category
    createUser(userInput: UserInput): User
    createTeam(teamInput: TeamInput): Team
    deleteTeam(teamId: ID!): Team
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
