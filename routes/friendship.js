const mongoose = require("mongoose");
const auth = require('../middleware/auth');
const { Friendship } = require('../models/friendship');
const { Friend } = require("../models/Friend");
const { User } = require("../models/user");
const express = require('express');
const router = express.Router();
const _ = require('lodash');

// @Description for each user, traverse through and save their email as a key
// and set the value to be true
function generateFriendsHashTable(users) {
  let hashTable = {};
  for (let user of users) {
    hashTable[user.userEmail] = true;
  }
  return hashTable;
}

router.get('/potentialFriends/:email', async (req, res) => {
  try {
    const currentUser = await User.findOne({ email: req.params.email });
    const users = await User.find();

    const response = await Friendship.findOne({ owner: currentUser._id });
    let friends = response ? response.friends : [];
    const friendsHashTable = generateFriendsHashTable(friends);

    // filter out users that are already in friend's list
    // and ensure user's profile is not included in list
    let remainingUsers = users.filter(user => (
      user.email != currentUser.email && !(user.email in friendsHashTable)
    ));

    remainingUsers = remainingUsers.map(user => {
      let userObj = user.toObject();
      return {
        name: user.name,
        email: user.email,
        photo: user.photo ? user.photo : '',
        status: 'Add Friend'
      };
    });

    res.send(remainingUsers);
  } catch (ex) {
    console.log("unable to retrieve", ex);
  }
});

router.post('/createRequest', (req, res) => {

});

router.get('/getFriends',async(req,res)=>{
  const user = await User.findOne({email:req.query[0]});
  let friends = await Friendship.findOne({owner: user._id});
  friends = friends ? friends.friends : [];
  res.send(friends);
});

router.get('/getFriendstatus',async(req,res)=>{
  const user = await User.findOne({email:req.query.email});
  let friends = await Friendship.findOne({owner: user._id});
  friends = friends.friends;
  var i;
  for(i=0;i<friends.length;i++){
    if(friends[i].userFreinds === req.query.fremail)
      res.send(friends[i].status);
  }

  res.send('Add Friend');
})

router.put('/acceptFriend',async(req,res) =>{
  const user =await User.findOne({ email: req.body.email });
  const curUser =await User.findOne({email: req.body.emailuse});
  let friendcurUser =await Friendship.findOne({owner: user._id});
  let frienduser =await Friendship.findOne({owner: curUser._id});


  var i;
  var exit = true;
  for(i=0;i<frienduser.friends.length;i++){
    if(frienduser.friends[i].userEmail === user.email){
      if(frienduser.friends[i].status === 'Accept')
        exit = true;
      else
        exit = false;
    }
  }
  if(exit){
    var frienduserarray=[];
    var friendcurUserArray=[];
    for(i=0;i<frienduser.friends.length;i++){
      let fr =new Friends();
      if(frienduser.friends[i].userEmail === user.email){
        fr.userid = frienduser.friends[i].userid;
        fr.userEmail = frienduser.friends[i].userEmail;
        fr.userPhoto = frienduser.friends[i].userPhoto;
        fr.status = 'Unfriend';
        frienduserarray.push(fr);
      }
      else{
        fr.userid = frienduser.friends[i].userid;
        fr.userEmail = frienduser.friends[i].userEmail;
        fr.userPhoto = frienduser.friends[i].userPhoto;
        fr.status = frienduser.friends[i].status;
        frienduserarray.push(fr);
      }
    }
    for(i=0;i<friendcurUser.friends.length;i++){
      let fr1 = new Friends();
      if(friendcurUser.friends[i].userEmail === curUser.email){
        fr1.userid = friendcurUser.friends[i].userid;
        fr1.userEmail = friendcurUser.friends[i].userEmail;
        fr1.userPhoto = friendcurUser.friends[i].userPhoto;
        fr1.status = 'Unfriend';
        friendcurUserArray.push(fr1);
      }
      else{
        fr1.userid = friendcurUser.friends[i].userid;
        fr1.userEmail = friendcurUser.friends[i].userEmail;
        fr1.userPhoto = friendcurUser.friends[i].userPhoto;
        fr1.status = friendcurUser.friends[i].status;
        friendcurUserArray.push(fr1);
      }
    }
    friendcurUser.friends=friendcurUserArray;
    await friendcurUser.save();
    frienduser.friends=frienduserarray;
    await frienduser.save();
    res.send("done");
  }
  else{
    res.send("err");
  }
});

router.put('/removeFriend', async(req,res) => {
  let userToRemove = await User.find({ email: req.body.userEmailToRemove });
  userToRemove = userToRemove[0];
  let currentUser = await User.find({email: req.body.currentUserEmail});
  currentUser = currentUser[0];

  let userToRemoveFriends = await Friendship.find({owner: userToRemove._id});
  userToRemoveFriends = userToRemoveFriends[0];
  let currentUserFriends = await Friendship.find({owner: currentUser._id});
  currentUserFriends = currentUserFriends[0];

  //in friendship.friends, remove/slice,
  userToRemoveFriends.friends = userToRemoveFriends.friends.filter(f => f.userEmail !== currentUser.email);
  currentUserFriends.friends = currentUserFriends.friends.filter(f => f.userEmail !== userToRemove.email);

  // then save
  await userToRemoveFriends.save();
  await currentUserFriends.save();

});

router.post("/addFriend", async (req, res) => {
  try {
    console.log("addFriend endpoint hit");
    // get both users
    let sender = await User.find({ email: req.body.currentUserEmail });
    sender = sender[0];
    let receiver = await User.find({ email: req.body.requestedUserEmail });
    receiver = receiver[0];

    // create friend model
    let friendshipSender = new Friend({ userid: sender._id, username: sender.name, userEmail: sender.email, userPhoto: sender.photo, status: 'Unfriend' });
    let friendshipReceiver = new Friend({ userid: receiver._id, username: receiver.name, userEmail: receiver.email, userPhoto: receiver.photo, status: 'Unfriend' });

    // // add frienships and save
    let senderFriendList = await Friendship.find({ owner: sender._id });
    senderFriendList = senderFriendList[0];
    let receiverFriendList = await Friendship.find({ owner: receiver._id });
    receiverFriendList = receiverFriendList[0];

    senderFriendList.friends.push(friendshipReceiver);
    receiverFriendList.friends.push(friendshipSender);
    await senderFriendList.save();
    await receiverFriendList.save();
  } catch (ex) {
    console.log("Unable to add friend ", ex);
  }
});

module.exports = router;
