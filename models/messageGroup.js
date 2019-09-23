const mongoose = require('mongoose');
const { messageSchema } = require('./message');

const messageGroupSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  messages: {
    type: [messageSchema]
  }
});

const MessageGroup = mongoose.model('MessageGroup', messageGroupSchema);

module.exports.MessageGroup = MessageGroup;
