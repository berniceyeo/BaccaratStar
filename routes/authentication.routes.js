import { Router } from "express";
import db from "../db/models/index.js";
import validationTypes from "../helperfunctions/validation.js";
import UserController from "../controllers/user.js";

const router = Router();
const userController = new UserController(db);

router.get("/login", (req, res) => {
  res.render("login", validationTypes.emptyValidation);
});

router.post("/login", userController.loginUser);

router.get("/signup", (req, res) => {
  res.render("signup", validationTypes.emptyValidation);
});

router.post("/signup", userController.createUser);

export default router;
