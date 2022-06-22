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

  socket.on("seat", async (data) => {
    console.log("in the room", data);
    socket.broadcast.emit("seated", data);
  });
});

http.listen(PORT, () => {
  console.log("application running at 3004");
});
