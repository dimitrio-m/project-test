const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const postSchema = mongoose.Schema({
  title: String,
  text: String,
  author: String,
  picture: {
    fileType: String,
    data: Buffer
  },
  group: Number,
  comments: [String],
  category: Number
});

module.exports = mongoose.model('Post', postSchema);
