const { Post } = require('../models/post');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/:userPostId', auth, async (req, res) => {
  try {
    // get the associated post
    const post = await Post.findById(req.params.userPostId);
    const newComment = {
      text: req.body.text,
      post: req.params.userPostId,
      author: req.user._id,
      dateCreated: Date.now()
    };
    post.comments.push(newComment);
    await post.save();
    res.send(newComment);
  } catch (ex) {
    console.log("Unable to add comment", ex);
  }
});

module.exports= router;
