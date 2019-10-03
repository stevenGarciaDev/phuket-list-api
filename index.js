const mongoose = require("mongoose");
const config = require('config');
const auth = require("./routes/auth");
const bucketList = require("./routes/bucketList");
const listItem = require("./routes/listItem");
const users = require("./routes/users");
const post = require("./routes/post");
const comment = require("./routes/comment");
const taskGroup = require("./routes/taskGroup");
const friends = require("./routes/friendship");
const message = require("./routes/message");
var cors = require('cors');
const express = require("express");
const app = express();
const httpServer = require('http').Server(app);
const io = require("socket.io")(httpServer);
var passport = require("passport");
const path = require('path');

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

const db = config.get('db');
mongoose.connect(db)
  .then(() => console.log(`Connected to db: ${db}`))
  .catch(() => console.log(`Unable to connect to db: ${db}`));

io.on('connect', (socket) => {
  console.log("User connected");
})

app.use(cors());
app.options('*', cors()); // this will enable cors for all your route.
app.use(express.json());
app.use(function(req, res, next) {
  req.io = io;
  next();
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,x-auth-token,access-control-expose-headers,Content-Type,Accept,content-type,application/json');
  next();
});

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/bucketList', bucketList);
app.use('/api/listitem', listItem);
app.use('/api/post', post);
app.use('/api/comment', comment);
app.use('/api/taskGroup', post);
app.use('/api/friends', friends);
app.use('/api/messages', message);
app.use(passport.initialize());
require("./config/passport");

// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const port = process.env.PORT || 3900;
const server = httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports.server = server;
module.exports.app = app;
