import getHash from "../helperfunctions/hash.js";
import cookieParser from "cookie-parser";
import { resolve } from "path";
import validationTypes from "../helperfunctions/validation.js";

class UserController {
  constructor(db) {
    this.db = db;
  }

  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkEmail = await this.db.User.findOne({
        where: {
          email: email,
        },
      });

      if (checkEmail === null) {
        throw new Error("Email does not exists");
      }

      const user = checkEmail.toJSON();
      const hashDBPassword = getHash(user.password);
      const hashSentPassword = getHash(password);

      if (hashDBPassword === hashSentPassword) {
        throw new Error("Password is incorrect");
      } else {
        res.cookie("hashedSession", getHash(user.id));
        res.cookie("userId", user.id);
        res.cookie("username", user.username);
        res.send("logged in");
      }
    } catch (error) {
      if (error.message === "Email does not exists") {
        res.send(error.message);
      } else if (error.message === "Password is incorrect") {
        res.send(error.message);
      } else {
        console.log(error);
      }
    }
  };

  logoutUser = async (req, res) => {
    try {
      res.clearCookie("userId");
      res.clearCookie("hashedSession");
      res.clearCookie("username");
      res.send("logout");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  createUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const checkEmail = await this.db.User.findOne({
        where: {
          email: email,
        },
      });

      if (checkEmail !== null) {
        throw new Error("User already exists");
      }

      const hashedPassword = getHash(password);

      const newUser = await this.db.User.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      res.send("signed up");
    } catch (error) {
      if (error.message === "User already exists") {
        res.send(error.message);
      }
      console.log(error);
    }
  };
}

export default UserController;
