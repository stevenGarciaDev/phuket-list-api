const request = require('supertest');
const { User } = require('../../models/user');
const { BucketList } = require('../../models/bucketList');
const { ListItem } = require('../../models/listItem');
const mongoose = require('mongoose');
let server;

describe('/api/bucketList', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(() => {
    server.close()
  });

  describe('GET /', () => {

    afterEach( async () => {
      await User.deleteMany({});
      await BucketList.deleteMany({});
      await ListItem.deleteMany({});
    });

    it("should return user's bucket list", async () => {
      const user = new User({
        name: 'TestUser',
        email: 'testEmail@gmail.com',
        password: 'password'
      });
      const newList = new BucketList();
      newList.owner = user._id;

      newList.listItems.push([
        { taskName: 'task1' },
        { taskName: 'task2' }
      ]);
      await user.save();
      await newList.save();

      let token = user.generateAuthToken();

      const res = await request(server)
        .get(`/api/bucketList/${user._id}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      console.log("response body is", res.body);
    });

    it("should return user's that have a shared list item", async () => {

    });
  });

});
