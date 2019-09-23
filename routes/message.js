const { MessageGroup } = require("../models/messageGroup");
const { Message } = require("../models/message");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post('/newGroup', async (req, res) => {
  try {
    let memberIds = req.body.members.map(m => m.id);
    const newGroup = new MessageGroup({
      dateCreated: Date.now(),
      messages: [],
      members: memberIds
    });
    console.log("new group is ", newGroup);
    await newGroup.save();
    res.send(newGroup);
  } catch (exception) {
    console.log("Unable to create ", exception);
  }
});

router.get('/retrieveMessageGroups/:user_id', async (req, res) => {
  // console.log('IO: ', req.io);
  // const io = req.io;
  // io.on("connection", socket => {
  //   console.log("conneted!");
  // });
  try {
    const response = await MessageGroup.find({ members: req.params.user_id });
    //console.log("response is ", response);
    res.send(response);
  } catch (ex) {
    console.log("Unable to retrieve ", ex);
  }
});

router.get('/getMostRecentMessage/:group_id', async (req, res) => {
  try {
    console.log("^the group is ", req.params.group_id);
    //const id = req.body.group._id;
    //console.log("the group id is ", id);
    //const response = await MessageGroup.findById(id);

  } catch (ex) {
    console.log("Unable to retrieve message", ex);
  }
});

router.get('/retrieveGroupMembers/:group_id', async (req, res) => {
  try {
    const data = await MessageGroup.findById(req.params.group_id);

    // retrieve data for users, name and image
    let members = [];
    //console.log("data members ", data.members);
    for (let i = 0; i < data.members.length; i++) {
      const user = await User.findById( data.members[i] ).select('name photo');
      data.members[i] = user;
    }
    //console.log("data is ", data);

    res.send(data);
  } catch (ex) {
    console.log("Unable to retrieve messages", ex);
  }
});

router.post('/newMessage/:senderId/:groupId', async (req, res) => {
  try {
    const messageGroup = await MessageGroup.findById(req.params.groupId);

    const newMessage = new Message({
      sender: req.params.senderId,
      message: req.body.msg,
      dateCreated: Date.now()
    });

    messageGroup.messages.push(newMessage);

    await messageGroup.save();

    req.io.emit("update messages", messageGroup);

    res.send(newMessage);
  } catch (ex) {
    console.log("Unable to add message", ex);
  }
});

module.exports = router;
