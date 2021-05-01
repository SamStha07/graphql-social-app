const { AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/check-auth');

module.exports = {
  Query: {
    // GET all posts
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    // GET single post by ID
    async getPostById(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // CREATE a post by logged in user
    async createPost(_, { body }, context) {
      // console.log(context);
      // will act as middleware if user is authenticated or not
      const user = checkAuth(context);
      // console.log(user);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = await Post.create({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      context.pubsub.publish('New Post', {
        newPost: newPost,
      });

      return newPost;
    },

    // DELETE a post by current logged in user
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    // POST
    // NOTE giving likes to a post
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // NOTE Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // NOTE Not liked, like post
          post.likes.push({ username, createdAt: new Date().toISOString() });
        }
        await post.save();

        return post;
      } else throw new UserInputError('Post not found');
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('New Post'),
    },
  },
};
