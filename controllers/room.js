import getHash from "../helperfunctions/hash.js";
import cookieParser from "cookie-parser";
import sequelizePackage from "sequelize";
const {
  DatabaseError,
  ValidationError,
  UniqueConstraintError,
} = sequelizePackage;

class RoomController {
  constructor(db) {
    this.db = db;
  }

  createRoom = async (req, res) => {
    const transaction = await this.db.sequelize.transaction();
    try {
      const { name, password, chips } = req.body;
      const { userId } = req;

      console.log(req.body);

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
      res.cookie("session", hashedRoom);

      const association = await this.db.User.update(
        {
          room_id: Number(roomId),
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
      const { name, password, chips } = req.body;
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
      res.cookie("session", hashedRoom);

      const association = await this.db.User.update(
        {
          room_id: Number(roomId),
          banker: false,
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

      res.send("join room");
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
}

export default RoomController;
