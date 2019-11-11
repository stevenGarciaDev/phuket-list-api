const mongoose = require("mongoose");
const Joi = require('@hapi/joi');

const listItemSchema = new mongoose.Schema({
  taskName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false,
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const ListItem = mongoose.model("ListItem", listItemSchema);

function validateItem(list) {
  const schema = {
    taskName: Joi.string.min(5).max(50).required(),
    isCompleted: Joi.boolean.required()
  };

  return Joi.validate(list, schema)
}

module.exports.ListItem = ListItem;
module.exports.listItemSchema = listItemSchema;
