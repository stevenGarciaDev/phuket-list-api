const { User } = require("../models/user");
const { BucketList } = require("../models/bucketList");
const { Friendship } = require("../models/friendship");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const passport = require("passport");

// login user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.send(401).send('user Does not exist');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');
  let friendsList = await Friendship.findOne({owner: user._id});
  if(!friendsList) {const userFreinds = new Friendship();
    console.log(user._id)
    userFreinds.owner = user._id;
    try{
    await userFreinds.save();
    }
    catch(ex){
    console.log("err");} }

  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string().min(5).max(255).required()
  }

  return Joi.validate(req, schema);
}


// GOOGLE API ROUTES
/* GET Google Authentication API. 
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    function(req, res) {
        var token = req.user.token;
        res.redirect("http://localhost:3000/login?token=" + token);
    }
);
*/

// Call back after google successful authenticate.
// Checks for existing account
// If it does not exist, create an account based off Google account credentials
// If exists, login.
router.post("/google/callback/validate", async function(req, res) {
        let user = await User.findOne({ email: req.body.email });
        if (user) { // Exists, then create token
          // Generate token
          const token = user.generateAuthToken();
          res
            .header('x-auth-token', token)
            .header("access-control-expose-headers", "x-auth-token")
            .send(token);
          console.log("Token: " + token);
          console.log("Res: " + res);
        } else { // Doesn't exist, create with rng password.
          console.log(req.body);
          user = new User( _.pick(req.body, ['name', 'email', 'password']) );
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          await user.save();

          const newList = new BucketList();
          newList.owner = user._id;
          await newList.save();
          //creating friends list for user that registers
          const userFreinds = new Friendship();

          userFreinds.owner = user._id;
          await userFreinds.save();

          //console.log(this.userFreinds);

          // Generate token
          const token = user.generateAuthToken();
          res
            .header('x-auth-token', token)
            .header("access-control-expose-headers", "x-auth-token")
            .send(token);
          console.log("Token: " + token);
          console.log("Res: " + res);
        }
    }

);


module.exports = router;
