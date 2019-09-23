const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const taskgroupSchema = new mongoose.Schema({
  taskID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListItem',
    required: true
  },
  groupMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }]
});

const TaskGroup = mongoose.model('TaskGroup', taskgroupSchema);

function validate(taskgroup) {
  const schema = {
    taskID: Joi.string().required(),
  };

  return Joi.validate(taskgroup, schema);
}

module.exports.TaskGroup = TaskGroup;
module.exports.validate = validate;
