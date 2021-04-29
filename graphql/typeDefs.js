const gql = require('graphql-tag');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }

  # will show as output
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  # this includes the fields as input
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    # sayHi: String! #! = require
    getPosts: [Post]
  }

  # mutation helps to modify data in data store and returns a value
  # can be used to insert, update or deleta data
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
  }
`;
