const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
mongoose.Promise = require('bluebird');

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  group: Number,
  posts: [String],
  comments: [String],
  gender: String,
  avatar: String
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
