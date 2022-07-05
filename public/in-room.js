// BUTTONS
const gameStartBtn = document.getElementById("start");
const leaveRoomBtn = document.getElementById("leave-room");
const removeRoomBtn = document.getElementById("remove-room");
const takeCardBtn = document.getElementById("take-card");
const skipTurnBtn = document.getElementById("skip-turn-btn");
const buyMoreBtn = document.getElementById("buy-chips-btn");
const showChangeBetBtn = document.getElementById("show-change-bet");
const changeBetBtn = document.getElementById("change-bet-btn");
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
//start countdown, change turns after 20 seconds
let startCountdown;

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

socket.on("changed-turn", async (data) => {
  const newTurn = data.newTurn;
  const oldTurn = data.oldTurn;
  const response = await axios.get("/game/userstate");
  const seatId = response.data.seat_id;
  if (newTurn === seatId) {
    startTimer();
  }
  controlsDisableEnable(newTurn, seatId);
  removeHighlighting(oldTurn, seatId);
  highlightingSeat(newTurn, seatId);
});

socket.on("skip-turn", async (turn) => {
  const response = await axios.get("/game/userstate");
  const seatId = response.data.seat_id;
  clearInterval(startCountdown);
  startCountdown = false;
  console.log("check interval", startCountdown);
  const newTurn = await change(turn, seatId);
  if (newTurn !== 1) {
    startCountdown = setInterval(() => {
      change(newTurn, seatId);
    }, 20000);
  }
});

socket.on("forced-removal", async (data) => {
  console.log("to kick out");
  const response = await axios.put("game/clear-roomcookie");
  if (response.data.success === "yes") {
    showResults();
  }
});

socket.on("stop-game", async (data) => {
  console.log("no players left");
  //if the game is still ongoing, end the game
  const response = await axios.put("game/end");
  clearCards();
  //reload to refresh stats
  window.location.reload();
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
  removeHighlighting(1, seatId);
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
    startCountdown = setInterval(() => {
      change(turn, seatId);
    }, 20000);
  } catch (error) {
    console.log(error);
    if (error.message === "no other players") {
      alert(
        "There are no other players in the game. Please wait till there are other players"
      );
    }
  }
};

// time out event to change turn every 20 seconds
const change = async (oldTurn, seatId) => {
  const response = await axios.put("game/turn-change");
  console.log(oldTurn, seatId);
  const newTurn = response.data.turn;
  const room = response.data.room;
  //send to socket that turn has been changed
  socket.emit("change-turn", [room, { newTurn, oldTurn }]);
  controlsDisableEnable(newTurn, seatId);
  removeHighlighting(oldTurn, seatId);
  highlightingSeat(newTurn, seatId);

  if (newTurn === 1) {
    startTimer();
    console.log("banker's turn");
    clearInterval(startCountdown);
    startCountdown = false;
    // if turn is 1, then after banker's turn to end it
    const end = setTimeout(endGame, 20000);
  }
  return newTurn;
};

const takeCard = async () => {
  const response = await axios.put("game/take-card");
  const { cards, turn, seatId, roomId } = response.data;
  takeCardBtn.disabled = true;
  skipTurnBtn.disabled = true;
  // if the user is not the banker, should send to banker (game functionality is running)  takeCardBtn.disabled = true;
  displayCardsPoints(cards);
  if (seatId !== 1) {
    socket.emit("take-card", [roomId, turn]);
  } else if (turn === 1) {
    console.log("end of banker's turn");
    clearInterval(startCountdown);
    startCountdown = false;
    //as the banker has chosen to skip his turn
    const end = setTimeout(endGame, 1000);
  }
};

const skipTurn = async () => {
  const response = await axios.get("/game/gamestate");
  const { seatId, game } = response.data;
  const roomId = game.id;
  const turn = game.game_state.turn;
  takeCardBtn.disabled = true;
  skipTurnBtn.disabled = true;

  if (seatId !== 1) {
    socket.emit("take-card", [roomId, turn]);
  } else if (turn === 1) {
    console.log("end of banker's turn");
    clearInterval(startCountdown);
    startCountdown = false;
    console.log("clearInterval", startCountdown);
    //as the banker has chosen to skip his turn
    const end = setTimeout(endGame, 1000);
  }
};

const buyMoreChips = async () => {
  const data = {
    chips: additionalChips.value,
  };
  const response = await axios.put("game/buy-more", data);
  $("#buy-more-modal").modal("hide");
  chipsSection.innerHTML = response.data.newchips;
  document.getElementById("chips-bought").innerHTML = response.data.chipsbought;
  document.getElementById("chips-hand").innerHTML = response.data.newchips;
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
    "GAME IS ENDING! <br> Here are the Results of the Game! ";
  document.getElementById("game-results-btn").click();
  setTimeout(() => {
    window.location.replace("http://localhost:3004/room");
  }, 2000);
};

//to end the game: only for banker side
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
  removeHighlighting(1, seatId);
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
leaveRoomBtn.addEventListener("click", exitRoom);
removeRoomBtn.addEventListener("click", removeRoom);
takeCardBtn.addEventListener("click", takeCard);
skipTurnBtn.addEventListener("click", skipTurn);
buyMoreBtn.addEventListener("click", buyMoreChips);
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
