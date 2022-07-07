/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */

import "core-js";
import "../css/styles.css";
import {
  stopTimer,
  startTimer,
  controlsDisableEnable,
  hideModal,
  presentingStatus,
  highlightingOtherSeats,
  removeHighlighting,
  highlightingSeat,
  reversingWinStatus,
  displayCardsPoints,
  clearCards,
  reshuffleSeats,
} from "./helper.js";

function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context("../assets/images/", true, /\.jpg\.svg\.png$/));

// BUTTONS
const gameStartBtn = document.getElementById("start");
const leaveRoomBtn = document.getElementById("leave-room");
const removeRoomBtn = document.getElementById("remove-room");
const takeCardBtn = document.getElementById("take-card");
const skipTurnBtn = document.getElementById("skip-turn-btn");
const buyMoreBtn = document.getElementById("buy-chips-btn");
const showChangeBetBtn = document.getElementById("show-change-bet");
const changeBetBtn = document.getElementById("change-bet-btn");
const endGameBtn = document.getElementById("final-end-btn");
//SEATS SECTIONS
const seatsBefore = document.getElementById("seats-bef");
const mainSeat = document.getElementById("main-seat");
const afterseating = document.getElementById("seats-after");
const allSeats = document.getElementsByClassName("seats");
//CHIPS AND POINTS SECTIONS
const points = document.getElementById("points");
const pointsDiv = document.getElementById("points-div");
const betSection = document.getElementById("bet");
const chipsSection = document.getElementById("chips");
const betDiv = document.getElementById("bet-div");
// BUY MORE CHIPS FORM
const additionalChips = document.getElementById("buychips");
// CHANGE BET FORM
const changeBetValue = document.getElementById("changebet");
//OTHER SECTIONS
const controls = document.getElementById("controls");
const waitingMessage = document.getElementById("waiting-message");
const resultsModalBody = document.getElementById("results");
const navUsername = document.getElementById("navbarDropdown");

//INTERVALS USED FOR COUNTDOWNS
let startCountdown;
let end;

//
//    SOCKET FUNCTIONS
//

const socket = io("http://localhost:3004");

socket.on("started", async (turn) => {
  waitingMessage.hidden = true;
  controls.hidden = false;
  const response = await axios.get("/game/gamestate");
  const seatId = response.data.seatId;
  const userGameState = response.data.game.game_state[seatId];
  const users = response.data.game.users;
  presentingStatus(users, seatId);
  displayCardsPoints(userGameState);
  //check if user has a new bet
  const newBet = localStorage.getItem("newbet");
  console.log(newBet);
  if (newBet !== null) {
    const response = await axios.put("/game/change-bet", { bet: newBet });
    betSection.innerHTML = newBet;
    localStorage.removeItem("newbet");
  }

  if (turn === seatId) {
    startTimer();
  }
  skipTurnBtn.addEventListener("click", skipTurn);
  takeCardBtn.addEventListener("click", takeCard);
  // to show on everyone pages whose turn it is
  highlightingSeat(turn, seatId);
  controlsDisableEnable(turn, seatId);
});

socket.on("seated", async (data) => {
  const personSeatId = data.seatId;
  const occupiedSeat = document.getElementById(personSeatId);
  occupiedSeat.classList.add("taken");
  const response = await axios.get("/game/gamestate");
  const userSeatId = response.data.seatId;
  const newUsers = response.data.game.users;
  presentingStatus(newUsers, userSeatId);
});

// FOR OTHER BESIDES THE BANKER
socket.on("changed-turn", async (data) => {
  console.log("newTurn", data);
  const newTurn = data.newTurn;
  const response = await axios.get("/game/userstate");
  const seatId = response.data.seat_id;
  if (newTurn === seatId) {
    startTimer();
  }
  controlsDisableEnable(newTurn, seatId);
  removeHighlighting();
  highlightingSeat(newTurn, seatId);
});

socket.on("skip-turn", async (turn) => {
  const response = await axios.get("/game/userstate");
  const seatId = response.data.seat_id;

  //only if its the banker
  if (seatId === 1) {
    //change the turn which inturn sets it up
    change();
    //reset the timer the turn which inturn sets it up
    clearInterval(startCountdown);
    clearTimeout(end);
    changeTurn();
  }
});

socket.on("forced-removal", async (data) => {
  console.log("to kick out");
  const response = await axios.put("game/clear-roomcookie");
  if (response.data.success === "yes") {
    showResults();
  }
});

socket.on("finalend", async (data) => {
  removeHighlighting();
  takeCardBtn.disabled = true;
  skipTurnBtn.disabled = true;
  points.innerHTML = "";
  stopTimer();
  clearCards();
  $("#leave-room-modal").modal("hide");
  document.getElementById("game-results-modalLabel").innerHTML =
    "GAME HAS ENDED! <br> Here are the Results of the Game! ";
  document.getElementById("game-results-btn").click();
});

socket.on("stop-game", async (data) => {
  console.log("no players left");
  //if the game is still ongoing, end the game
  const response = await axios.put("game/end");
  clearCards();
  //reload to refresh stats
  window.location.reload();
  alert("last player has left, game has stopped");
});

socket.on("player-bought", async (chipsInfo) => {
  const userId = chipsInfo.userId;
  const newChips = chipsInfo.newChips;
  const chipsBought = chipsInfo.chipsBought;
  const row = document.getElementById(`status-${userId}`);
  row.cells.item(1).innerHTML = chipsBought;
  row.cells.item(2).innerHTML = newChips;
});

socket.on("ended", async (winStatus) => {
  points.innerHTML = "";
  clearCards();
  const response = await axios.get("/game/userstate");
  const seatId = response.data.seat_id;
  const chips = response.data.chips;
  chipsSection.innerHTML = chips;
  const winState = winStatus[seatId];
  resultsModalBody.innerHTML = `You ${winState}`;
  document.getElementById("results-modal-btn").click();
  removeHighlighting();
  //AFTER 1 SEC TO HIDE MODAL OF RESULTS
  const hide = setTimeout(hideModal, 1000);
});

//
//    PAGE FUNCTIONS
//

const init = async () => {
  try {
    const response = await axios.get("/game/userstate");
    const user = response.data;
    const room = user.room_id;
    const seatId = user.seat_id;
    const { username, bet, chips } = user;
    navUsername.innerHTML = username;
    //to on the server side, join the room
    socket.emit("join-room", room);
    console.log(`user is attempting to join ${room}`);
    betSection.innerHTML = bet;
    chipsSection.innerHTML = chips;

    //CHECK FOR USERS WHO HAVE SAT DOWN
    const checkUsers = await axios.get("/game/roomusers");
    const otherUsers = checkUsers.data.users;
    if (otherUsers !== undefined) {
      const allUsers = [user, ...otherUsers];
      presentingStatus(allUsers, seatId);
    }
    //highlights the seat of the other users
    highlightingOtherSeats(otherUsers, "seat-");

    //  CHECK IF USER HAS SAT DOWN
    if (seatId === null || seatId === undefined) {
      seatsBefore.hidden = false;
    } else {
      if (seatId !== 1) {
        controls.hidden = false;
        gameStartBtn.hidden = true;
        reshuffleSeats(seatId);
        waitingMessage.hidden = false;
      } else {
        endGameBtn.hidden = false;
        showChangeBetBtn.hidden = true;
        betDiv.hidden = true;
        pointsDiv.style.left = "48%";
      }

      highlightingOtherSeats(otherUsers, "");
      afterseating.hidden = false;

      //CHECK IF GAME HAS STARTED
      const res = await axios.get("/game/gamestate");
      const gameState = res.data.game.game_state;
      // if the game has started
      if (gameState !== null) {
        const userGameState = gameState[seatId];
        displayCardsPoints(userGameState);
        waitingMessage.hidden = true;
        const turn = gameState.turn;

        if (turn !== null) {
          highlightingSeat(turn, seatId);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const gameStart = async () => {
  try {
    const response = await axios.post("/game/start");
    if (response.data === "no other players") {
      throw new Error("no other players");
    }
    endGameBtn.hidden = false;
    const gameState = response.data.game.game_state;
    const users = response.data.game.users;
    const user = response.data.user;
    const room = user.room_id;
    const chips = user.chips;
    const seatId = user.seat_id;
    presentingStatus(users, seatId);
    chipsSection.innerHTML = chips;

    const turn = gameState.turn;
    const userGameState = gameState[seatId];
    displayCardsPoints(userGameState);
    highlightingSeat(turn, seatId);

    socket.emit("start-game", [room, turn]);
    console.log(turn, seatId);
    controlsDisableEnable(turn, seatId);
    changeTurn();
  } catch (error) {
    console.log(error);
    if (error.message === "no other players") {
      alert(
        "There are no other players in the game. Please wait till there are other players"
      );
    }
  }
};

const changeTurn = async () => {
  startCountdown = setInterval(change, 10000);
};

const change = async () => {
  const response = await axios.put("game/turn-change");
  const newTurn = response.data.turn;
  const room = response.data.room;
  const seatId = response.data.seatId;
  if (newTurn === seatId) {
  }
  //send to socket that turn has been changed
  socket.emit("change-turn", [room, { newTurn }]);
  controlsDisableEnable(newTurn, seatId);
  removeHighlighting();
  highlightingSeat(newTurn, seatId);

  if (newTurn === 1) {
    startTimer();
    console.log("banker's turn");
    clearInterval(startCountdown);
    // if turn is 1, then after banker's turn to end it
    end = setTimeout(endGame, 10000);
  }
};

const takeCard = async () => {
  const response = await axios.put("game/take-card");
  const { cards, turn, seatId, roomId } = response.data;
  takeCardBtn.disabled = true;
  skipTurnBtn.disabled = true;
  displayCardsPoints(cards);
  stopTimer();

  if (seatId !== 1) {
    socket.emit("take-card", [roomId, turn]);
  } else if (turn === 1) {
    clearInterval(startCountdown);
    clearTimeout(end);
    const quickEnd = setTimeout(endGame, 1000);
  }
};

const skipTurn = async () => {
  const response = await axios.get("/game/gamestate");
  const { seatId, game } = response.data;
  const roomId = game.id;
  const turn = game.game_state.turn;
  takeCardBtn.disabled = true;
  skipTurnBtn.disabled = true;
  stopTimer();

  if (seatId !== 1) {
    socket.emit("take-card", [roomId, turn]);
  } else if (turn === 1) {
    clearInterval(startCountdown);
    clearTimeout(end);
    const quickEnd = setTimeout(endGame, 1000);
  }
};

const buyMoreChips = async () => {
  const data = {
    chips: additionalChips.value,
  };
  const response = await axios.put("game/buy-more", data);
  $("#buy-more-modal").modal("hide");
  const userId = response.data.userId;
  const roomId = response.data.roomId;
  const chipsBought = response.data.chipsbought;
  const newChips = response.data.newchips;
  const row = document.getElementById(`status-${userId}`);
  row.cells.item(1).innerHTML = chipsBought;
  row.cells.item(2).innerHTML = newChips;
  socket.emit("bought-more", [roomId, { userId, newChips, chipsBought }]);
  chipsSection.innerHTML = response.data.newchips;
  document.getElementById("chips-bought").innerHTML = chipsBought;
  document.getElementById("chips-hand").innerHTML = newChips;
  document.getElementById("buy-results-btn").click();
  setTimeout(() => {
    $("#buy-results-modal").modal("hide");
  }, 2000);
};

const changeBet = async () => {
  localStorage.setItem("newbet", changeBetValue.value);
  document.getElementById("change-bet-form").hidden = true;
  document.getElementById("change-bet-btn").disabled = true;
  document.getElementById("bet-note").hidden = false;
  setTimeout(() => {
    $("#change-bet-modal").modal("hide");
  }, 2000);
};

const showResults = () => {
  $("#leave-room-modal").modal("hide");
  document.getElementById("game-results-modalLabel").innerHTML =
    "GAME HAS ENDED! <br> Here are the Results of the Game! ";
  document.getElementById("game-results-btn").click();
  setTimeout(() => {
    window.location.replace("http://localhost:3004/room");
  }, 2000);
};

const endGame = async () => {
  const response = await axios.put("game/end");
  console.log(response);
  const seatId = response.data.seatId;
  const room = response.data.room;
  const winStatus = response.data.winStatus;

  socket.emit("end-game", [room, winStatus]);

  //if the user is not banker, they will show the win/lose
  let innerContent = "";
  for (const [key, value] of Object.entries(winStatus)) {
    const newContent = reversingWinStatus(key, value);
    innerContent += newContent;
  }
  resultsModalBody.innerHTML = innerContent;
  document.getElementById("results-modal-btn").click();
  removeHighlighting();
  for (let i = 1; i < 3; i++) {
    const seat = document.getElementById(`mainseat-${i}`);
    seat.hidden = true;
  }
  const hide = setTimeout(hideModal, 1000);
  points.innerHTML = "";
  clearCards();
  const start = setTimeout(gameStart, 2000);
};

const exitRoom = () => {
  try {
    axios.put(`/game/leave`).then((response) => {
      console.log(response.data);
      if (response.data === "User is banker") {
        document.getElementById("leave-room-modal-btn").click();
      } else if (response.data.success === "no") {
        socket.emit("no-player", response.data.roomId);
        showResults();
      } else if (response.data === "left room") {
        showResults();
      }
    });
  } catch (error) {}
};

const removeRoom = () => {
  try {
    axios.delete(`/game/delete`).then((response) => {
      if (response.data.success === "yes") {
        const roomId = response.data.roomId;
        socket.emit("removed-room", roomId);
        showResults();
      }
    });
  } catch (error) {}
};

const finalEndGame = async () => {
  const response = await axios.put("game/end");
  const seatId = response.data.seatId;
  const room = response.data.room;
  controls.hidden = true;
  takeCardBtn.disabled = true;
  skipTurnBtn.disabled = true;
  gameStartBtn.hidden = false;
  stopTimer();
  socket.emit("final-end", room);
  removeHighlighting();
  points.innerHTML = "";
  clearCards();
  $("#leave-room-modal").modal("hide");
  document.getElementById("game-results-modalLabel").innerHTML =
    "GAME HAS ENDED! <br> Here are the Results of the Game! ";
  document.getElementById("game-results-btn").click();
};

const logout = async () => {
  const response = await axios.post("/logout");
  if (response.data === "logout") {
    window.location.replace("http://localhost:3004");
  }
};

// ------------------------------------
// BUTTONS EVENTS
// ------------------------------------
gameStartBtn.addEventListener("click", gameStart);
endGameBtn.addEventListener("click", finalEndGame);
leaveRoomBtn.addEventListener("click", exitRoom);
removeRoomBtn.addEventListener("click", removeRoom);
buyMoreBtn.addEventListener("click", buyMoreChips);
takeCardBtn.addEventListener("click", takeCard);
skipTurnBtn.addEventListener("click", skipTurn);
changeBetBtn.addEventListener("click", changeBet);
showChangeBetBtn.addEventListener("click", () => {
  document.getElementById("change-bet-form").hidden = false;
  document.getElementById("bet-note").hidden = true;
  document.getElementById("change-bet-btn").disabled = false;
});
document.getElementById("nav-logout").addEventListener("click", logout);
init();

//When the person joins the room, they can click which seat they want to sit in
Array.from(allSeats).forEach((btn) => {
  if (btn.classList.contains("banker")) {
  } else {
    btn.addEventListener("click", function assignSeat(event) {
      let seatId = Number(this.id.slice(5));
      try {
        const data = {
          seatId,
        };

        //update the user's seat
        axios.put("/game/seat", data).then((response) => {
          console.log(response.data);
          if (response.data.success === "yes") {
            const room = response.data.user.roomId;
            afterseating.hidden = false;
            seatsBefore.hidden = true;
            controls.hidden = false;
            gameStartBtn.hidden = true;
            waitingMessage.hidden = false;
            reshuffleSeats(seatId);
            console.log(room);
            socket.emit("seat", [room, data]);
          }
        });
      } catch (error) {}
    });
  }
});
