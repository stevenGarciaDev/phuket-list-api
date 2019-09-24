const { MessageGroup } = require("../models/messageGroup");
const { Message } = require("../models/message");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post('/newGroup', async (req, res) => {
  try {
    let memberIds = req.params.members.map(m => m.id);
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


router.post('/newMessageGroup', async (req, res) => {
  try {
    let memberIds = req.body.members[0]; // any members in this newMsgGroup
    let mesGroupName = req.body.name; // name of group chat
   
    console.log("memberIds");
    console.log(memberIds);
    console.log(mesGroupName);

    const msgGroup = await MessageGroup.find({ name: mesGroupName }); // find msg group with same name as the one sent
    console.log("members [] : ", msgGroup);
    //if(msgGroup != null ) // check if message group being created already exists
    //{ 
      //if yes, update that msg group with new members
      //msgGroup.members.push("sddf");
      //console.log("members [][] : ", msgGroup);
     // res.send(msgGroup);
   // }
   // else{ 
      // if not make new group
      const newGroup = new MessageGroup({
        dateCreated: Date.now(),
        name: mesGroupName,
        messages: [],
        members: memberIds
      });
      console.log("new group is ", newGroup);
      await newGroup.save();
      
      res.send(newGroup);
    //}
    
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
