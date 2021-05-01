const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/check-auth');

module.exports = {
  Mutation: {
    // HACK async createComment(_,{}){}
    // CREATE
    createComment: async (_, { postId, body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not be empty',
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        // NOTE comments will be added to the first index of the array using unshift
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },

    // DELETE
    // NOTE all comments can be deleted by post author
    // NOTE users can only delete their own comments in anothers post
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);

        if (
          post.comments[commentIndex].username === username ||
          post.username === username
        ) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
};
