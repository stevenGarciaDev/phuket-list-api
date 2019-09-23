const mongoose = require('mongoose');
const { FriendSchema } = require("./Friend");

const friendshipSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friends: {
    type: [FriendSchema],
    default: []
  }
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports.Friendship = Friendship;
