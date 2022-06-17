import getHash from "../helperfunctions/hash.js";
import cookieParser from "cookie-parser";
import sequelizePackage from "sequelize";
const { DatabaseError, ValidationError } = sequelizePackage;

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
          updatedAt: new Date(),
        },
        {
          where: {
            id: userId,
          },
          transaction,
        }
      );
      await transaction.commit();
      res.send("done");
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      if (error instanceof ValidationError) {
        const error = {
          message: "room name is not unique",
        };
        res.send(error);
      }
    }
  };

  joinRoom = async (req, res) => {
    try {
      const { name, password, chips } = req.body;
      const { userId } = req;

      const findRoom = await this.db.Room.findBy({
        where: {
          name: name,
        },
      });

      const findRoomJson = findRoom.toJSON();
      const roomId = findRoomJson.id;
      const hashedRoom = getHash(roomId);
      +res.cookie("session", hashedRoom);

      const association = await this.db.User.update(
        {
          room_id: Number(roomId),
          banker: true,
          chips_bought: Number(chips),
          chips: Number(chips),
          updatedAt: new Date(),
        },
        {
          where: {
            id: userId,
          },
          transaction,
        }
      );
      await transaction.commit();
      res.send("done");
    } catch (error) {
      console.log(error);
      await transaction.rollback();
    }
  };
}

export default RoomController;