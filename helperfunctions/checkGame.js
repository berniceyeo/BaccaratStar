import db from "../db/models/index.js";

const checkGame = async (req, res, next) => {
  try {
    const userId = req.cookies.userId;
    const hashedGame = req.cookies.room;
    const game = await db.User.findByPk(userId);
    const roomId = game.room_id;
    if (roomId && hashedGame) {
      req.roomId = Number(roomId);
      next();
    } else {
      throw new Error("user not in game");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/room");
  }
};

export default checkGame;
