const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { commentSchema } = require('./comment');

const postSchema = new mongoose.Schema({
  topicID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListItem',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    maxlength: 144,
    trim: true,
    required: true
  },
  image: {
    type: String
  },
  isAppropriate: {
    type: Boolean,
    default: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: {
    type: [commentSchema],
    default: []
  }
});

const Post = mongoose.model('Post', postSchema);

function validate(post) {
  const schema = {
    text: Joi.string().max(144),
    image: Joi.string(),
    topicID: Joi.objectId().required()
  };

  return Joi.validate(post, schema);
}

module.exports.Post = Post;
module.exports.validate = validate;
