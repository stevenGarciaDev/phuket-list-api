function connectSocketIO(req, res, next) {
  io.on("connection", socket => {
    console.log("connected socket.io");
  });
}
