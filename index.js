// ===================  3rd Party  ==================================
// Import all 3rd party packages
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

const cors = require('cors');
const mongoose = require('mongoose');

// ===================  Personal  ==================================
const isAuth = require('./middleware/isAuth');
const graphQLSchema = require('./routes/graphql/schema');
const graphQLResolvers = require('./routes/graphql/resolvers');
const characterRouter = require('./routes/api/characters');
const itemRouter = require('./routes/api/items');

// ===================  Initialize Variables  ==================================

// Initialize App
const app = express();

// Determine port
const PORT = process.env.PORT || 4000;

// ===================  Middleware Pipeline  ==================================

// HTTP request security
app.use(cors());
// Authentication security
app.use(isAuth);
// For json body reading
app.use(bodyParser.json());
// For url form data
app.use(express.urlencoded({ extended: false }));
// static middleware
app.use(express.static(path.join(__dirname, 'public')));

// --------------------  GraphQL Routing  ---------------------

// GraphQL middleware: takes requests and forwards them to the appropriate resolvers
app.use(
  '/graphql',
  graphqlHttp({
    // ORM: Performs heavy lifting of converting template literal strings to javascript objects
    schema: graphQLSchema,
    // Resolvers: Correlates one-for-one with the above query and mutation names. Executes the logic when
    // a graphql query enters the server.
    rootValue: graphQLResolvers,
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
