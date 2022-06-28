import { Router } from "express";
import { resolve } from "path";
import db from "../db/models/index.js";
import UserController from "../controllers/user.js";

const router = Router();
const userController = new UserController(db);

router.get("/", (req, res) => {
  res.sendFile(resolve("./views/main.html"));
});

router.post("/login", userController.loginUser);
router.post("/signup", userController.createUser);

router.get("/room", (req, res) => {
  res.sendFile(resolve("./views/pre-room.html"));
});

router.get("/game", (req, res) => {
  res.sendFile(resolve("./views/in-room.html"));
});

export default router;
