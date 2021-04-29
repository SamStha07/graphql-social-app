const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  // we will handle required fields from graphql
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

module.exports = model('User', userSchema);
