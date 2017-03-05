const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const commentSchema = mongoose.Schema({
  author: String,
  group: Number,
  category: Number,
  post: String,
  text: String
});

module.exports = mongoose.model('Comment', commentSchema);
