import getHash from "../helperfunctions/hash.js";
import cookieParser from "cookie-parser";

class UserController {
  constructor(db) {
    this.db = db;
  }

  loginUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const checkEmail = await this.db.User.findOne({
        email: email,
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
        res.cookie("userId", getHash(user.id));
        res.cookie("username", user.username);
        res.redirect("/game");
      }
    } catch {}
  };

  logoutUser = async (req, res) => {
    res.clearCookie("userId");
    res.clearCookie("username");
    res.redirect("/");
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
        throw new Error("user already exists");
      }

      const newUser = await this.db.User.create({
        username: username,
        email: email,
        password: password,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
