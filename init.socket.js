const init = (io) => {
  // when we connect, we show that someone has joined
  io.on("connection", (socket) => {
    console.log("user has connected");
  });
  return io;
};
