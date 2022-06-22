import { Router } from "express";
import db from "../db/models/index.js";
import RoomController from "../controllers/room.js";
import authenticate from "../helperfunctions/authenticate.js";

const router = Router();
const roomController = new RoomController(db);

router.post("/game/create", authenticate, roomController.createRoom);
router.post("/game/join", authenticate, roomController.joinRoom);

export default router;
