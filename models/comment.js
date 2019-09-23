const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  text: {
    type: String,
    max: 144,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports.Comment = Comment;
module.exports.commentSchema = commentSchema;
