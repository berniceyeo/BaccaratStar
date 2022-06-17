import getHash from "../helperfunctions/hash.js";
import cookieParser from "cookie-parser";
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
        res.redirect("/game");
      }
    } catch (error) {
      if (error.message === "Email does not exists") {
        res.render("login", validationTypes.noUser);
      } else if (error.message === "Password is incorrect") {
        res.render("login", validationTypes.passwordIncorrect);
      } else {
        console.log(error);
      }
    }
  };

  logoutUser = async (req, res) => {
    res.clearCookie("userId");
    res.clearCookie("hashedSession");
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

      const hashedPassword = getHash(password);

      const newUser = await this.db.User.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      res.redirect("/login");
    } catch (error) {
      if (error.message === "user already exists") {
        res.render("signup", validationTypes.userExists);
      }
      console.log(error);
    }
  };
}

export default UserController;
