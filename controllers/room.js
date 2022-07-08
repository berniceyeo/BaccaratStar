import getHash from "../helperfunctions/hash.js";
import sequelizePackage from "sequelize";
import { Op } from "sequelize";

const { UniqueConstraintError } = sequelizePackage;

class RoomController {
  constructor(db) {
    this.db = db;
  }

  checkRoomSeat = async (req, res) => {
    try {
      const { userId } = req;
      const user = await this.db.User.findByPk(userId);
      const userDetails = user.toJSON();
      res.send(userDetails);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  checkUsers = async (req, res) => {
    try {
      const { userId } = req;
      const { roomId } = req;
      const room = await this.db.Room.findOne({
        where: {
          id: roomId,
        },
        include: {
          model: this.db.User,
          where: {
            id: {
              [Op.ne]: userId,
            },
          },
        },
      });

      res.send(room);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  createRoom = async (req, res) => {
    const transaction = await this.db.sequelize.transaction();
    try {
      const { name, password, chips, bet } = req.body;
      const { userId } = req;
      const hashedPassword = getHash(password);
      const newRoom = await this.db.Room.create(
        {
          name,
          password: hashedPassword,
        },
        {
          transaction,
        }
      );

      const newRoomJson = newRoom.toJSON();
      const roomId = newRoomJson.id;
      const hashedRoom = getHash(roomId);
      res.cookie("room", hashedRoom);

      const association = await this.db.User.update(
        {
          room_id: Number(roomId),
          seat_id: 1,
          banker: true,
          chips_bought: Number(chips),
          chips: Number(chips),
          updatedAt: Date.now(),
        },
        {
          where: {
            id: userId,
          },
          transaction,
        }
      );
      await transaction.commit();
      res.send("create room");
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      if (error instanceof UniqueConstraintError) {
        const data = {
          message: "room name is not unique",
        };
        res.send(data);
      } else {
        const data = {
          message: error.message,
        };
        res.send(data);
      }
    }
  };

  joinRoom = async (req, res) => {
    try {
      const { name, password, chips, bet } = req.body;
      const { userId } = req;

      const findRoom = await this.db.Room.findOne({
        where: {
          name: name,
        },
      });

      if (findRoom === null) {
        throw new Error("No such room exists");
      }

      const findRoomJson = findRoom.toJSON();
      const roomId = findRoomJson.id;
      const hashedPassword = getHash(password);
      const storedPassword = findRoomJson.password;

      if (storedPassword !== hashedPassword) {
        throw new Error("Incorrect Password");
      }

      const hashedRoom = getHash(roomId);
      res.cookie("room", hashedRoom);

      const association = await this.db.User.update(
        {
          room_id: Number(roomId),
          banker: false,
          bet: Number(bet),
          chips_bought: Number(chips),
          chips: Number(chips),
          updatedAt: Date.now(),
        },
        {
          where: {
            id: userId,
          },
        }
      );

      const seatsTaken = await this.db.Room.findOne({
        where: {
          id: roomId,
        },
        include: [
          {
            model: this.db.User,
            //find users who are not banker and not null
            where: {
              seat_id: {
                [Op.gt]: 1,
              },
            },
          },
        ],
      });

      res.send(seatsTaken);
    } catch (error) {
      console.log(error);
      if (error.message === "Incorrect Password") {
        const data = {
          message: "Incorrect Password",
        };
        res.send(data);
      } else if (error.message === "No such room exists") {
        const data = {
          message: "No such room exists",
        };
        res.send(data);
      }
    }
  };

  sitDown = async (req, res) => {
    try {
      const { seatId } = req.body;
      const { userId } = req;

      const [num, updateUser] = await this.db.User.update(
        {
          seat_id: Number(seatId),
        },
        {
          where: {
            id: userId,
          },
          returning: true,
        }
      );
      console.log(updateUser[0]);

      res.send({ success: "yes", user: updateUser[0] });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  leaveRoom = async (req, res) => {
    const { roomId } = req;
    try {
      const { userId } = req;
      const user = await this.db.User.findByPk(userId);
      const userJson = user.toJSON();

      if (userJson.banker === true) {
        throw new Error("User is banker");
      } else {
        await user.update({
          banker: false,
          room_id: null,
          seat_id: null,
          chips: null,
          chips_bought: null,
          updatedAt: Date.now(),
        });

        res.clearCookie("room");
        const room = await this.db.Room.findOne({
          where: {
            id: roomId,
          },
          include: {
            model: this.db.User,
          },
        });

        if (room.users.length <= 1) {
          throw new Error("User is last user");
        }
        res.send("left room");
      }
    } catch (error) {
      console.log(error);
      if (error.message === "User is last user") {
        const data = {
          success: "no",
          roomId,
        };
        res.send(data);
      } else {
        res.send(error.message);
      }
    }
  };

  removeRoomCookies = async (req, res) => {
    try {
      const userId = req.userId;
      const user = await this.db.User.findByPk(userId);
      const userJson = user.toJSON();

      console.log(userJson.room_id);
      console.log(userJson.roomId);
      if (userJson.room_id !== null) {
        throw new Error("User has yet to be kicked");
      } else {
        res.clearCookie("room");
        res.send({ success: "yes" });
      }
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  removeRoom = async (req, res) => {
    const transaction = await this.db.sequelize.transaction();

    try {
      const { userId } = req;
      const roomId = req.roomId;

      const user = await this.db.User.findByPk(userId);
      const userJson = user.toJSON();

      if (userJson.banker === false) {
        throw new Error("User is not banker");
      }

      const game = await this.db.Room.findByPk(roomId);
      const allUsers = await game.getUsers();

      for (let i = 0; i < allUsers.length; i++) {
        await allUsers[i].update(
          {
            banker: false,
            room_id: null,
            seat_id: null,
            chips: null,
            chips_bought: null,
            updatedAt: Date.now(),
          },
          {
            transaction,
          }
        );
      }

      await game.destroy({
        transaction,
      });

      await transaction.commit();
      res.clearCookie("room");
      const data = {
        success: "yes",
        roomId,
      };
      res.send(data);
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.send(error.message);
    }
  };
}

export default RoomController;
