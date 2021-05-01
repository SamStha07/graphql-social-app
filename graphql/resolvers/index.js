const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
  // Modifiers
  // NOTE each time any query or mutations or subscriptions that returns a post, it will go through this Post modifier and apply this modifications like likeCount and commentCount
  // NOTE after getPosts query this Post modifier will run
  Post: {
    // parent returns all the previous values holding the data
    likeCount: (parent) => {
      // console.log(parent);
      return parent.likes.length;
    },
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
