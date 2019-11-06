const { Post, validate } = require('../models/post');
const { User } = require('../models/user');
const { BucketList } = require('../models/bucketList');
const { ListItem } = require('../models/listItem');
const { Friendship } = require('../models/friendship');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// API endpoint to retrieve all post related to User
router.get('/activityPage', auth, async (req, res) => {
  try {
    // so get User's bucket list, and their list items,
    const bucketList = await BucketList.find({ owner: req.user._id });
    const listItems = bucketList[0].listItems;

    let recentPostsFeed = [];
    //get post from those list items
    for (let i = 0; i < listItems.length; i++) {
      // get all most recent 5 post from the list item
      let topicID = listItems[i]._id;
      let recentPost = await Post.find({ topicID })
        .sort({ dateCreated: -1 })
        .populate('author', 'name')
        .limit(25);

      //console.log("Likes are...", recentPost[0].recentPos);
      recentPostsFeed = [...recentPostsFeed, ...recentPost];
      //console.log('recent post are', recentPostsFeed);
    }

    //console.log("id for FIRST LIKE", recentPostsFeed[2].likes[0]);
    res.send(recentPostsFeed);
  } catch (ex) {
    console.log('unable to query', ex);
  }

});

// API endpoint to retrieve activity feed posts
router.get('/activityFeed/:limit/:skip', auth, async (req, res) => {
  try {
    // so get User's bucket list, and their list items,
    const bucketList = await BucketList.find({ owner: req.user._id });
    const friends = await Friendship.find({ owner: req.user._id });
    const listItems = bucketList[0].listItems;
    const friendItems = friends[0].friends;

    // Get IDs only from users list
    let userItemsIDs = [];
    for (let i = 0; i < listItems.length; i++) {
        let topicID = listItems[i]._id;
        userItemsIDs = userItemsIDs.concat(topicID);
    }

    let friendIDs = [];
    for (let i = 0; i < friendItems.length; i++) {
        let friendID = friendItems[i].userid;
        friendIDs = friendIDs.concat(friendID);
    }

    let recentPosts = await Post.find({
      "$or": [
        { topicID: { $in: userItemsIDs }},
        { author: { $in: friendIDs }}
      ]
    })
      .sort({ dateCreated:-1 })
      .populate('author', 'name')
      .limit(parseInt(req.params.limit))
      .skip(parseInt(req.params.skip));
    res.send(recentPosts);
  } catch (ex) {
    console.log('unable to query', ex);
  }
});

// API endpoint to retrieve post corresponding to a topicID
router.get('/:topicId', auth, async (req, res) => {
  let posts = [];
  try {
    //console.log("The topic id is", req.params.topicID);
    posts = await Post
      .find({ topicID: req.params.topicId })
      .populate('author', 'name')
      .sort({ dateCreated: -1 });
    //console.log(posts);
  } catch(ex) {
    console.log("No post were found");
  }
  res.send(posts);
});

// create a new Post,
router.post('/', auth, async (req, res, next) => {
  let post = "";
  try {
    post = new Post({
      text: req.body.text,
      image: req.body.image,
      topicID: req.body.topicID,
      author: req.user._id,
      dateCreated: Date.now()
    });

    const username = await User.findById(req.user._id ).select('name');
    await post.save();
    post.author = username;
    console.log("post is ", post)
    console.log("new post saved");
  } catch (ex) {
    console.log('unable to create post', ex);
  }
  res.send(post);
});

router.post('/delPost',async (req, res) => {
  console.log(req.body.id);
  let post = await Post.find({_id: req.body.id});
  console.log(post); 
  const response = await Post.deleteOne({_id: req.body.id});
  res.send(response);
 } );

router.post('/:id', async (req, res) => {
    console.log("getting backend request");
});

// for updating the like attribute in Post model
router.post('/:id/likes', auth, async (req, res) => {
  console.log('backend reached for update');
  const { likesArr } = req.body;

  try {
    console.log("the POST ID TO LIKE Is", req.params.id);
    console.log("BODY", req.body);
    const post = await Post.findById(req.params.id);

    if (likesArr[0] == null) {
      post.likes = [];
    } else {
      post.likes = likesArr;
    }

    post.save();
    console.log(post.likes);
  } catch (ex) {
    console.log("unable to update Post's likes", ex);
  }
});

router.delete('/:id', auth, async (req, res) => {

});

router.put('/reportPost/:topicId', async (req, res) => {
   try {
     const Posts = await Post.findById(req.params.topicId);
     Posts.isAppropriate = false;
     Posts.save();

     var transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
      }
  });

  console.log('created');
  transporter.sendMail({
  from: 'phukitlist@gmail.com',
    to: 'phukitlist@gmail.com',
    subject: 'Post reported',
    text: 'A Post has been deemed inappropriate and therefore reported and is hidden from other users.'
  },
  (err, response) => {
    if (err) {
      console.error('there was an error: ', err);
    } else {
      console.log('here is the res: ', response);
      res.status(200).json('report emailed');
    }
  }
  );

    } catch (e) {
        //print(e);
    }

});


router.get('/getIsAppropriate/:topicId', async (req, res) => {
  try {
    const Posts = await Post.findById(req.params.topicId);
    res.send(Posts.isAppropriate);
   } catch (e) {
       //print(e);
   }
});

// API endpoint to retrieve activity feed posts
router.get('/UserPostFeed/:id/:limit/:skip', auth, async (req, res) => {
  try {
    let recentPosts = await Post.find({author: req.params.id})
      .sort({ dateCreated:-1 })
      .populate('author', 'name')
      .limit(parseInt(req.params.limit))
      .skip(parseInt(req.params.skip));
    res.send(recentPosts);
  } catch (ex) {
    console.log('unable to query', ex);
  }
});

module.exports = router;
