const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 144,
  },
  dateCreated: {
    type: Date,
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);

function validate(message) {
  const schema = {
    message: Joi.string().max(144).required(),
    sender: Joi.objectId().required()
  };

  return Joi.validate(message, schema);
}

module.exports.Message = Message;
module.exports.messageSchema = messageSchema;
module.exports.validate = validate;
