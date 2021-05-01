const { ApolloServer, PubSub } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const { MONGODB } = require('./config.js');

// graphql
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

// for subscription
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB connected');
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => console.log(err.message));
