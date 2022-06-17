import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

import userRouter from "./routes/authentication.routes.js";
import gameRouter from "./routes/game.routes.js";

// CREATING THE APP
const app = express();
const PORT = process.env.PORT || 3004;

// configure env variables
const envFilePath = ".env";
dotenv.config({ path: path.normalize(envFilePath) });

// set  the express view engine to expect ejs templates
app.set("view engine", "ejs");
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

app.listen(PORT);
