const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { username, password }) {
      // NOTE validate login data
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // NOTE find user
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      // NOTE compare both password and hash password(user.password which is hashed using bcrypt)
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return { ...user._doc, id: user._id, token };
    },

    // args = registerInput
    // register(parent, args, context , info)
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // NOTE validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // NOTE Make sure user doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }

      // NOTE hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      // in restAPI, res.body hunthyo
      // res._doc = email, username, createdAt from grapql body
      return { ...res._doc, id: res._id, token };
    },
  },
};
