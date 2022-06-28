import { createDeck, shuffleDeck } from "../helperfunctions/deck.js";
import { Op } from "sequelize";

class GameController {
  constructor(db) {
    this.db = db;
  }

  gameStart = async (req, res) => {
    try {
      const cardDeck = shuffleDeck(createDeck());
      const userId = req.userId;
      const roomId = req.roomId;

      //get all users from game and the game details
      const getGame = await this.db.Room.findOne({
        where: {
          id: roomId,
        },
        include: {
          model: this.db.User,
        },
      });

      const users = getGame.users;

      //if there isnt any other users
      if (users.length < 2) {
        throw new Error("no other players");
      }

      // creating the game state json variable
      const gameState = {
        turn: 2,
      };

      //for each player in the game, deal 2 cards
      for (let i = 0; i < users.length; i++) {
        const playerHand = [cardDeck.pop(), cardDeck.pop()];
        const id = users[i].id;
        gameState[id] = playerHand;
      }

      getGame.update({
        game_state: gameState,
      });

      //send the new game state
      res.send(gameState[userId]);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  gameState = async (req, res) => {
    try {
      const cardDeck = shuffleDeck(createDeck());
      const userId = req.userId;
      const roomId = req.roomId;

      //get the user
      const user = await this.db.User.findByPk(userId);
      const game = await user.getRoom();
      const data = {
        userId,
        game,
      };
      //send the new game state
      res.send(data);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  //game state store the person's turn
}

export default GameController;
