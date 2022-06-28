// BUTTONS
const gameStartBtn = document.getElementById("start");
const leaveRoomBtn = document.getElementById("leave-room");
const removeRoomBtn = document.getElementById("remove-room");
const takeCardBtn = document.getElementById("take-card");

//SECTIONS
const seatsBefore = document.getElementById("seats-bef");
const mainSeat = document.getElementById("main-seat");
const afterseating = document.getElementById("seats-after");
const allSeats = document.getElementsByClassName("seats");
const controls = document.getElementById("controls");
const waitingMessage = document.getElementById("waiting-message");

// SOCKET
const socket = io("http://localhost:3004");

socket.on("seated", (data) => {
  const occupiedSeat = document.getElementById(data.seatId);
  occupiedSeat.classList.add("taken");
});

socket.on("started", async () => {
  waitingMessage.hidden = true;
  controls.hidden = false;
  const response = await axios.get("/game/gamestate");
  const userId = response.data.userId;
  const userGameState = response.data.game.game_state[userId];
  displayCardsPoints(userGameState);
});

//FROM PAGE
const init = async () => {
  try {
    const response = await axios.get("/game/userstate");
    const seatId = response.data.seat_id;
    console.log(seatId);
    if (seatId === null) {
      seatsBefore.hidden = false;
    } else {
      if (seatId !== 1) {
        controls.hidden = false;
        gameStartBtn.hidden = true;
        waitingMessage.hidden = false;
        reshuffleSeats(seatId);
      }
      afterseating.hidden = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const exitRoom = () => {
  try {
    axios.put(`/game/leave`).then((response) => {
      console.log(response.data);
      if (response.data === "User is banker") {
        $("#leave-room-modal").modal("show");
      } else if ("left room") {
        window.location.replace("http://localhost:3004/room");
      }
    });
  } catch (error) {}
};

const removeRoom = () => {
  try {
    axios.delete(`/game/delete`).then((response) => {
      if (response.data === "removed room") {
        window.location.replace("http://localhost:3004/room");
      } else {
        $("#leave-room-modal").modal("show");
      }
    });
  } catch (error) {}
};

const gameStart = async () => {
  try {
    const gameState = await axios.post("/game/start");
    const data = gameState.data;
    displayCardsPoints(data);
    socket.emit("start-game");
  } catch (error) {
    console.log(error);
  }
};

//When the person joins the room, they can click which seat they want to sit in
Array.from(allSeats).forEach((btn) => {
  btn.addEventListener("click", function assignSeat(event) {
    seatId = Number(this.id.slice(5));
    try {
      const data = {
        seatId,
      };
      //update the user's seat
      axios.put("/game/seat", data).then((response) => {
        if (response.data === "seated") {
          afterseating.hidden = false;
          seatsBefore.hidden = true;
          reshuffleSeats(seatId);
          socket.emit("seat", data);
        }
      });
    } catch (error) {}
  });
});

// BUTTONS EVENTS
gameStartBtn.addEventListener("click", gameStart);
leaveRoomBtn.addEventListener("click", exitRoom);
removeRoomBtn.addEventListener("click", removeRoom);
init();
