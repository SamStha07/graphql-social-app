const gql = require('graphql-tag');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    user: ID!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  # will show as output
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    # password: String! better not to show hashed password to the user
  }

  # NOTE this includes the fields as input
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    # sayHi: String! #! = require
    getUsers: [User]
    getPosts: [Post]
    getPostById(postId: ID!): Post
  }

  # NOTE mutation helps to modify data in data store and returns a value
  # NOTE can be used to insert, update or deleta data
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;
