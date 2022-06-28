import { Router } from "express";
import db from "../db/models/index.js";
import RoomController from "../controllers/room.js";
import GameController from "../controllers/game.js";
import authenticate from "../helperfunctions/authenticate.js";
import checkGame from "../helperfunctions/checkGame.js";

const router = Router();
const roomController = new RoomController(db);
const gameController = new GameController(db);

router.post("/game/create", authenticate, roomController.createRoom);
router.post("/game/join", authenticate, roomController.joinRoom);
router.post("/game/start", authenticate, checkGame, gameController.gameStart);
router.get(
  "/game/gamestate",
  authenticate,
  checkGame,
  gameController.gameState
);
router.get("/game/userstate", authenticate, roomController.checkRoomSeat);
router.put("/game/seat", authenticate, checkGame, roomController.sitDown);
router.put("/game/leave", authenticate, checkGame, roomController.leaveRoom);
router.delete(
  "/game/delete",
  authenticate,
  checkGame,
  roomController.removeRoom
);

export default router;
