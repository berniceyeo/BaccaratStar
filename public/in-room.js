// BUTTONS
const gameStartBtn = document.getElementById("start");
const leaveRoomBtn = document.getElementById("leave-room");
const removeRoomBtn = document.getElementById("remove-room");
const takeCardBtn = document.getElementById("take-card");
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

// SOCKET
const socket = io("http://localhost:3004");

socket.on("seated", (data) => {
  const occupiedSeat = document.getElementById(data.seatId);
  occupiedSeat.classList.add("taken");
});

socket.on("started", async (turn) => {
  waitingMessage.hidden = true;
  controls.hidden = false;
  const response = await axios.get("/game/gamestate");
  const seatId = response.data.seatId;
  const userGameState = response.data.game.game_state[seatId];
  displayCardsPoints(userGameState);
  //check if user has a new bet
  const newBet = localStorage.getItem("newbet");
  console.log(newBet);
  if (newBet !== null) {
    const response = await axios.put("/game/change-bet", { bet: newBet });
    betSection.innerHTML = newBet;
    localStorage.removeItem("newbet");
  }

  // to show on everyone pages whose turn it is
  highlightingSeat(turn, seatId);
});

socket.on("changed-turn", async (data) => {
  const newTurn = data.newTurn;
  const oldTurn = data.oldTurn;
  const response = await axios.get("/game/userstate");
  const seatId = response.data.seat_id;
  //if now its users turn
  removeHighlighting(oldTurn, seatId);
  highlightingSeat(newTurn, seatId);
});

socket.on("ended", async (winStatus) => {
  const response = await axios.get("/game/userstate");
  const seatId = response.data.seat_id;
  const chips = response.data.chips;
  chipsSection.innerHTML = chips;
  const winState = winStatus[seatId];
  resultsModalBody.innerHTML = `You ${winState}`;
  document.getElementById("results-modal-btn").click();
  removeHighlighting(1, seatId);
  points.innerHTML = "";
  document.getElementById("mainseat-1").backgroundImage = "none";
  document.getElementById("mainseat-2").backgroundImage = "none";
  document.getElementById("mainseat-3").backgroundImage = "none";
  const hide = setTimeout(hideModal, 1000);
});

//checks the current status of the users' game so that when they refresh, they do not lose the status of their game
const hideModal = () => {
  $("#results-modal").modal("hide");
};

const init = async () => {
  try {
    const response = await axios.get("/game/userstate");
    const room = response.data.room_id;
    socket.emit("join-room", room);
    console.log(`user is attempting to join ${room}`);

    const seatId = response.data.seat_id;
    const bet = response.data.bet;
    const chips = response.data.chips;
    betSection.innerHTML = bet;
    chipsSection.innerHTML = chips;

    //if the person has yet to sit down
    if (seatId === null || seatId === undefined) {
      seatsBefore.hidden = false;
    } else {
      // if the person sat down and is not banker
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

      // if the person sat down, apply to all inclu banker
      afterseating.hidden = false;
      //to check if the game has started
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

//when they exit room for users whom they are not banker

const exitRoom = () => {
  try {
    axios.put(`/game/leave`).then((response) => {
      if (response.data === "User is banker") {
        document.getElementById("leave-room-modal-btn").click();
      } else if ("left room") {
        window.location.replace("http://localhost:3004/room");
      }
    });
  } catch (error) {}
};

//when they exit room for users whom they are banker
const removeRoom = () => {
  try {
    axios.delete(`/game/delete`).then((response) => {
      if (response.data === "removed room") {
        window.location.replace("http://localhost:3004/room");
      } else {
        document.getElementById("leave-room-modal-btn").click();
      }
    });
  } catch (error) {}
};

// initialise game start
const gameStart = async () => {
  try {
    const response = await axios.post("/game/start");
    const userResponse = await axios.get("/game/userstate");
    const room = userResponse.data.room_id;
    const chips = userResponse.data.chips;
    chipsSection.innerHTML = chips;

    console.log(response);
    if (response.data === "no other players") {
      throw new Error("no other players");
    }

    const seatId = response.data.seatId;
    console.log(seatId);
    const turn = response.data.game.game_state.turn;
    const userGameState = response.data.game.game_state[seatId];
    displayCardsPoints(userGameState);
    highlightingSeat(turn, seatId);
    console.log(room);
    socket.emit("start-game", [room, turn]);
    console.log(turn, seatId);
    changeTurns(turn, seatId);
  } catch (error) {
    console.log(error);
    if (error.message === "no other players") {
      alert(
        "There are no other players in the game. Please wait till there are other players"
      );
    }
  }
};

const takeCard = async () => {
  const response = await axios.put("game/take-card");
  displayCardsPoints(response.data);
  takeCardBtn.disabled = true;
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

//to end the game: only for banker side
const endGame = async () => {
  const response = await axios.put("game/end");
  const seatId = response.data.seatId;
  const room = response.data.room;
  const winStatus = response.data.winStatus;
  console.log(room);
  socket.emit("end-game", [room, winStatus]);
  console.log(winStatus);
  //if the user is not banker, they will show the win/lose
  let innerContent = "";
  for (const [key, value] of Object.entries(winStatus)) {
    if (value === "Win") {
      innerContent += `Seat ${key} : Lose <br>`;
    } else if (value === "Lose") {
      innerContent += `Seat ${key} : Win <br>`;
    }
  }
  resultsModalBody.innerHTML = innerContent;
  document.getElementById("results-modal-btn").click();
  removeHighlighting(1, seatId);
  for (let i = 1; i < 3; i++) {
    const seat = document.getElementById(`mainseat-${i}`);
    seat.hidden = true;
  }
  points.innerHTML = "";
  document.getElementById("mainseat-1").backgroundImage = "none";
  document.getElementById("mainseat-2").backgroundImage = "none";
  document.getElementById("mainseat-3").backgroundImage = "none";
  const hide = setTimeout(hideModal, 1000);
  const start = setTimeout(gameStart, 2500);
};

// so every thirty seconds
const changeTurns = async (oldTurn, seatId) => {
  const change = async () => {
    const response = await axios.put("game/turn-change");
    const newTurn = response.data.turn;
    const room = response.data.room;
    socket.emit("change-turn", [room, { newTurn, oldTurn }]);
    removeHighlighting(oldTurn, seatId);
    highlightingSeat(newTurn, seatId);

    if (newTurn === 1) {
      console.log("banker's turn");
      clearInterval(startCountdown);
      const end = setTimeout(endGame, 20000);
    }
  };
  const startCountdown = setInterval(change, 20000);
};

// ------------------------------------
// BUTTONS EVENTS
// ------------------------------------
gameStartBtn.addEventListener("click", gameStart);
leaveRoomBtn.addEventListener("click", exitRoom);
removeRoomBtn.addEventListener("click", removeRoom);
takeCardBtn.addEventListener("click", takeCard);
buyMoreBtn.addEventListener("click", buyMoreChips);
changeBetBtn.addEventListener("click", changeBet);
showChangeBetBtn.addEventListener("click", () => {
  document.getElementById("change-bet-form").hidden = false;
  document.getElementById("bet-note").hidden = true;
  document.getElementById("change-bet-btn").disabled = false;
});
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
