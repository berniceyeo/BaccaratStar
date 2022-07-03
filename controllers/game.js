import { createDeck, shuffleDeck } from "../helperfunctions/deck.js";
import { generateWinStatus } from "../helperfunctions/checkwin.js";
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

      //get the seatId of the user
      const user = await this.db.User.findByPk(userId);
      const seatId = user.seat_id;

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

      //sorting the users based on their seat to see who starts first
      const sortedUsers = users.sort((a, b) => {
        return a.seat_id - b.seat_id;
      });

      //if there isnt any other users
      if (users.length < 2) {
        throw new Error("no other players");
      }

      const currentTurn = sortedUsers[1].seat_id;

      // creating the game state json variable
      const gameState = {
        turn: currentTurn,
      };

      //for each player in the game, deal 2 cards.
      for (let i = 0; i < users.length; i++) {
        const playerHand = [cardDeck.pop(), cardDeck.pop()];
        const seat = users[i].seat_id;
        gameState[seat] = playerHand;
      }

      gameState["deck"] = cardDeck;

      await getGame.update({
        game_state: gameState,
      });

      const data = {
        seatId,
        game: getGame,
      };

      //send the new game state
      res.send(data);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  changeTurn = async (req, res) => {
    try {
      const roomId = req.roomId;

      //get all users from game and the game details as we would need to pass the turn to the next user
      const getGame = await this.db.Room.findOne({
        where: {
          id: roomId,
        },
        include: {
          model: this.db.User,
        },
      });

      //if there isnt any other users
      if (getGame.game_state === null || getGame.game_state === undefined) {
        throw new Error("the game has not start");
      }

      //increase the turn by 1
      const users = getGame.users;
      const gameState = { ...getGame.game_state };
      const currentTurn = gameState.turn;
      let index;

      //check what is the user's index
      users.forEach((user, i) => {
        if (user.seat_id === currentTurn) {
          index = i;
        }
      });

      let newTurn;

      //if there is no next player, then return to banker
      if (index === users.length - 1) {
        newTurn = 1;
      } else {
        newTurn = users[index + 1].seat_id;
      }

      //change the game state to the turn
      gameState.turn = newTurn;

      await getGame.update({
        game_state: gameState,
      });

      //send the new game state
      res.send({ turn: newTurn });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  takeCard = async (req, res) => {
    try {
      const userId = req.userId;
      const roomId = req.roomId;

      const user = await this.db.User.findByPk(userId);
      const seatId = user.seat_id;

      const game = await this.db.Room.findByPk(roomId);
      const gameState = { ...game.game_state };

      const deck = gameState.deck;
      const playerCards = gameState[seatId];
      playerCards.push(deck.pop());

      gameState[seatId] = playerCards;
      gameState.deck = deck;
      console.log(gameState.turn);

      await this.db.Room.update(
        {
          game_state: gameState,
        },
        {
          where: {
            id: roomId,
          },
        }
      );

      res.send(playerCards);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };

  buyMore = async (req, res) => {
    try {
      const userId = req.userId;
      const roomId = req.roomId;
      const moreChips = req.body.chips;

      const user = await this.db.User.findByPk(userId);
      const existingChips = Number(user.chips);
      const newChips = existingChips + Number(moreChips);
      const existingChipsBought = Number(user.chips_bought);
      const newChipsBought = existingChipsBought + Number(moreChips);

      await user.update({
        chips_bought: newChipsBought,
        chips: newChips,
      });

      res.send({ newchips: newChips, chipsbought: newChipsBought });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };

  gameState = async (req, res) => {
    try {
      const userId = req.userId;
      const roomId = req.roomId;

      const user = await this.db.User.findByPk(userId);
      const seatId = user.seat_id;
      const getGame = await this.db.Room.findOne({
        where: {
          id: roomId,
        },
        include: {
          model: this.db.User,
        },
      });

      const data = {
        seatId,
        game: getGame,
      };

      res.send(data);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  };

  endGame = async (req, res) => {
    const transaction = await this.db.sequelize.transaction();
    try {
      const userId = req.userId;
      //get the user
      const user = await this.db.User.findByPk(userId);
      let bankerChips = Number(user.chips);
      console.log("banker", bankerChips);
      const seatId = user.seat_id;
      const game = await user.getRoom();
      //generate win status
      const winStatus = generateWinStatus(game.game_state);
      //clear the game
      await game.update({
        game_state: null,
      });

      for (const [key, value] of Object.entries(winStatus)) {
        const playerSeat = key;
        //to get the player
        const player = await this.db.User.findOne({
          where: {
            seat_id: playerSeat,
          },
        });
        let playerBet = Number(player.bet);
        let playerChips = Number(player.chips);
        console.log("player", playerBet, playerChips);
        if (value === "Win") {
          bankerChips = bankerChips - playerBet;
          playerChips = playerChips + playerBet;
        } else if (value === "Lose") {
          bankerChips = bankerChips + playerBet;
          playerChips = playerChips - playerBet;
        }
        console.log("player", playerBet, playerChips);
        console.log("banker", bankerChips);

        await player.update(
          {
            chips: playerChips,
          },
          {
            transaction,
          }
        );
      }

      await user.update(
        {
          chips: bankerChips,
        },
        { transaction }
      );

      const data = {
        seatId,
        winStatus,
      };
      await transaction.commit();
      //send the new game state
      res.send(data);
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.send(error.message);
    }
  };

  //game state store the person's turn
}

export default GameController;
