const request = require('supertest');
const { User } = require('../../models/user');
const { BucketList } = require('../../models/bucketList');
const { ListItem } = require('../../models/listItem');
const { Friendship } = require("../../models/friendship");
const { MessageGroup } = require("../../models/messageGroup");
const { Post } = require("../../models/post");
const mongoose = require('mongoose');
let server;

describe('/api/user', () => {

  beforeEach(() => {
    server = require('../../index');
    userId = mongoose.Types.ObjectId();
  });

  afterEach(() => {
    server.close()
  });

  describe('DELETE /', () => {
    let userId;
    let user;

    beforeEach( async () => {
      // create a User
      user = new User({
        name: 'TestUser',
        email: 'testEmail@gmail.com',
        password: 'password'
      });
      await user.save();

      // create an associated BucketList
      const newList = new BucketList();
      newList.owner = user._id;

      // create a ListItem
      let listItem = new ListItem({ taskName: 'task1' });
      listItem = await listItem.save();

      newList.listItems.push(listItem);
      await newList.save();

      // create a post
      const post = new Post({
        topicID: listItem._id,
        author: user._id,
        text: "test post",
        dateCreated: Date.now()
      });
      await post.save();

      // create a comment
    });

    afterEach( async () => {
      // clear test database
      await User.deleteMany({});
      await BucketList.deleteMany({});
      await ListItem.deleteMany({});
      await Friendship.deleteMany({});
      await Post.deleteMany({});
    });

    it('should delete all associated user data', async () => {
      // call endpoint,

      
      // User is unsubscribed to MessageGroups
      // User's messages are removed
      // User's likes on post are deleted
      // User's comments on post are deleted
      // User's post are deleted
      // User is unsubscribed from TaskGroups
      // User's BucketList is deleted
      // User's account is deleted
    });
  });
});
