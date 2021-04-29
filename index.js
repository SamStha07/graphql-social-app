const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const { MONGODB } = require('./config.js');

// graphql
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

// const typeDefs = gql`
//   type Post {
//     id: ID!
//     body: String!
//     createdAt: String!
//     username: String!
//   }
//   type Query {
//     # sayHi: String! #! = require
//     getPosts: [Post]
//   }
// `;

// const resolvers = {
//   Query: {
//     // sayHi: () => 'Hello World!!!',
//     async getPosts() {
//       try {
//         const posts = await Post.find();
//         return posts;
//       } catch (err) {
//         throw new Error(err);
//       }
//     },
//   },
// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
