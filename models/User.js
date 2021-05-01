const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  // NOTE we will handle validations from graphql
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

module.exports = model('User', userSchema);
