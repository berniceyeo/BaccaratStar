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
//get the status of the game that is going on (i.e. cards and deck)
router.get(
  "/game/gamestate",
  authenticate,
  checkGame,
  gameController.gameState
);
//get the status of the user (i.e. the user's seat and the person's room)
router.get("/game/userstate", authenticate, roomController.checkRoomSeat);
router.get(
  "/game/roomusers",
  authenticate,
  checkGame,
  roomController.checkUsers
);
router.put(
  "/game/turn-change",
  authenticate,
  checkGame,
  gameController.changeTurn
);
router.put("/game/take-card", authenticate, checkGame, gameController.takeCard);
router.put("/game/buy-more", authenticate, checkGame, gameController.buyMore);
router.put(
  "/game/change-bet",
  authenticate,
  checkGame,
  gameController.changeBet
);
router.put("/game/seat", authenticate, checkGame, roomController.sitDown);
router.put(
  "/game/clear-roomcookie",
  authenticate,
  roomController.removeRoomCookies
);
router.put("/game/end", authenticate, checkGame, gameController.endGame);
router.put("/game/leave", authenticate, checkGame, roomController.leaveRoom);
router.delete(
  "/game/delete",
  authenticate,
  checkGame,
  roomController.removeRoom
);

export default router;
