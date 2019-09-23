const mongoose = require("mongoose");
const Joi = require('@hapi/joi');

const FriendSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String
  },
  userEmail: {
    type: String
  },
  userPhoto: {
    type: String
  },
  status: {
    type: String,
    enum: ['Accept', 'Unfriend', 'Add Friend'],
    default: 'Add Friend'
  }
});

const Friend = mongoose.model("Friend", FriendSchema);

module.exports.Friend = Friend;
module.exports.FriendSchema = FriendSchema;
