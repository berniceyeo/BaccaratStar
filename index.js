import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

//starting the socket
import { createServer } from "http";
import { Server } from "socket.io";
// import init from "./init.socket.js";

import userRouter from "./routes/authentication.routes.js";
import gameRouter from "./routes/game.routes.js";

// CREATING THE APP
const app = express();
const http = createServer(app);
const io = new Server(http);
const PORT = process.env.PORT || 3004;

// configure env variables
const envFilePath = ".env";
dotenv.config({ path: path.normalize(envFilePath) });

// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride("_method"));
// Expose the files stored in the public folder
app.use(express.static("public"));
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
//  data in AJAX POST requests is packaged differently from those in form submissions
app.use(express.json());
app.use(cookieParser());

app.use("/", userRouter);
app.use("/", gameRouter);

io.on("connection", (socket) => {
  console.log("a user has logged in");

  //data is the room_id of the user
  socket.on("join-room", async (data) => {
    console.log(`a user has joined room ${data}`);
    socket.join(data);
  });

  //returns the seat_id of the user
  socket.on("seat", async (data) => {
    console.log("in the room", data);
    const room = data[0];
    const seatId = data[1];
    socket.to(room).emit("seated", seatId);
  });

  //returns what turn it is now as well as the message to start the game
  socket.on("start-game", (data) => {
    console.log("game has started", data);
    const room = data[0];
    const turn = data[1];
    socket.to(room).emit("started", turn);
  });

  // returns the new turn and old turn to the users, to present to the front end
  socket.on("change-turn", (data) => {
    console.log("change turn", data);
    const room = data[0];
    const turnInfo = data[1];
    socket.to(room).emit("changed-turn", { ...turnInfo });
  });

  socket.on("take-card", (data) => {
    console.log("user-took-card", data);
    const room = data[0];
    const turn = data[1];
    socket.to(room).emit("skip-turn", turn);
  });

  // to display the results of the game
  socket.on("end-game", (data) => {
    console.log("ended", data);
    const room = data[0];
    const winStatus = data[1];
    socket.to(room).emit("ended", winStatus);
  });

  // to display the results of the game
  socket.on("no-player", (data) => {
    console.log("no more players in room");
    const room = data;
    socket.to(room).emit("stop-game", data);
  });

  // to kick all users in a room out of the room
  socket.on("removed-room", (data) => {
    console.log("ended", data);
    const room = data;
    socket.to(room).emit("forced-removal", data);
  });
});

http.listen(PORT, () => {
  console.log("application running at 3004");
});
