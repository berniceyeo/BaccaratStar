import { cardImageSources } from "./imageSources.js";

//HELPER FUNCIONS
export const toggleValidity = (element, validity) => {
  if (validity === "valid") {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
  }
};

export const checkBlanks = (
  name,
  password,
  chips,
  invalidName,
  formName,
  invalidPass,
  formPass,
  invalidChips,
  formChips
) => {
  if (name === "") {
    invalidName.innerHTML = "Please input a valid name";
    invalidName.hidden = false;
    toggleValidity(formName, "invalid");
  } else {
    invalidName.hidden = true;
    toggleValidity(formName, "valid");
  }

  if (password === "") {
    invalidPass.innerHTML = "Please input a valid password";
    invalidPass.hidden = false;
    toggleValidity(formPass, "invalid");
  } else {
    invalidPass.hidden = true;
    toggleValidity(formPass, "valid");
  }

  if (chips === "") {
    invalidChips.innerHTML = "Please input some chips you want to buy";
    invalidChips.hidden = false;
    toggleValidity(formChips, "invalid");
  } else {
    invalidChips.hidden = true;
    toggleValidity(formChips, "valid");
  }
};

// FUNCTIONS RELATED TO SEATS
export const reshuffleSeats = (seatId) => {
  const restOfSeats = document.getElementsByClassName("seated");
  let currentSeat = seatId + 1;

  for (let i = 0; i < restOfSeats.length; i++) {
    if (currentSeat === 12) {
      currentSeat = 1;
    }

    restOfSeats[i].id = currentSeat;
    currentSeat += 1;
  }

  const banker = document.getElementById("1");
  banker.classList.add("banker");
  banker.innerHTML = "Banker";
};

//DISPLAYS CARDS
export const clearCards = () => {
  document.getElementById("mainseat-1").style.backgroundImage = "none";
  document.getElementById("mainseat-2").style.backgroundImage = "none";
  document.getElementById("mainseat-3").style.backgroundImage = "none";
};

export const displayCardsPoints = (data) => {
  console.log("cards", data);
  let sum = 0;
  let stringSum;

  for (let i = 0; i < data.length; i++) {
    sum += data[i].points;
    stringSum = String(sum).slice(-1);
    const card = document.getElementById(`mainseat-${i + 1}`);
    card.innerHTML = "";
    const picSourceSuit = data[i].suit;
    const picSourceRank = data[i].rank;
    const picSourceURL = cardImageSources[picSourceSuit][picSourceRank];
    card.style.backgroundImage = `url(${picSourceURL})`;
    card.hidden = false;
  }
  if (data.length === 3) {
    document.getElementById("mainseat-1").style.left = "43%";
    document.getElementById("mainseat-2").style.left = "46%";
    document.getElementById("mainseat-3").hidden = false;
  } else if (data.length === 2) {
    document.getElementById("mainseat-1").style.left = "44%";
    document.getElementById("mainseat-2").style.left = "48%";
    document.getElementById("mainseat-3").hidden = true;
    document.getElementById("mainseat-3").style.backgroundImage = "none";
  }

  const points = document.getElementById("points");
  points.innerHTML = `${stringSum}`;
  gameStartBtn.hidden = true;
  controls.hidden = false;
};

export const reversingWinStatus = (key, value) => {
  let innerContent = "";
  if (value === "Win") {
    innerContent += `Seat ${key} : Lose <br>`;
  } else if (value === "Win-Double") {
    innerContent += `Seat ${key} : Lose Double <br>`;
  } else if (value === "Win-Triple") {
    innerContent += `Seat ${key} : Lose Triple <br>`;
  } else if (value === "Win-Five Times") {
    innerContent += `Seat ${key} : Lose Five Times <br>`;
  } else if (value === "Lose") {
    innerContent += `Seat ${key} : Win <br>`;
  } else if (value === "Lose-Double") {
    innerContent += `Seat ${key} : Win Double <br>`;
  } else if (value === "Lose-Triple") {
    innerContent += `Seat ${key} : Win Triple <br>`;
  } else if (value === "Lose-Five Times") {
    innerContent += `Seat ${key} : Win Five Times <br>`;
  } else if (value === "Draw") {
    innerContent += `Seat ${key} : Draw <br>`;
  }
  console.log("innner", innerContent);
  return innerContent;
};

export const highlightingSeat = (turn, seatId) => {
  if (turn === seatId) {
    const turnSeat = document.getElementById("mainseat-back");
    turnSeat.classList.add("turn");
    takeCardBtn.disabled = false;
  } else {
    const turnSeat = document.getElementById(`${turn}`);
    turnSeat.classList.add("turn");
    takeCardBtn.disabled = true;
  }
};

//clear highlighting
export const removeHighlighting = () => {
  const turnSeat = document.getElementById("mainseat-back");
  turnSeat.classList.remove("turn");
  const allSeats = document.getElementsByClassName("seated");
  for (let i = 0; i < allSeats.length; i++) {
    const seat = allSeats[i];
    if (seat.classList.contains("turn")) {
      seat.classList.remove("turn");
    }
  }
};

export const highlightingOtherSeats = (users, string) => {
  if (users !== undefined) {
    users.forEach((user) => {
      if (user.seat_id !== 1) {
        const seat = document.getElementById(`${string}${user.seat_id}`);
        seat.classList.add("taken");
        seat.disabled = true;
      }
    });
  }
};

export const presentingStatus = (data, seatId) => {
  document.getElementById("game-results-btn").hidden = false;
  const table = document.getElementById("game-results-table");
  const status = localStorage.getItem("status"); //null if have yet to b created

  //for when its a single entry
  let users;
  if (Array.isArray(data) === false) {
    users = [data];
  } else {
    users = [...data];
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (document.getElementById(`status-${user.id}`) === null) {
      console.log("generating new");
      //check if the user information is already found in the table
      const row = table.insertRow();
      row.id = `status-${user.id}`;
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      if (user.banker === true) {
        cell1.innerHTML = "Banker";
      } else {
        cell1.innerHTML = user.username;
        cell1.classList.add("text-capitalize");
      }

      cell2.innerHTML = user.chips_bought;
      cell3.innerHTML = user.chips;
      cell4.innerHTML = Number(user.chips) - Number(user.chips_bought);

      if (user.seat_id === seatId) {
        row.classList.add("table-warning");
      } else {
        row.style.color = "white";
      }
    } else {
      //if the document does have the user infromation, update the info
      console.log("changing old");
      const row = document.getElementById(`status-${user.id}`);
      console.log(row.cells);
      row.cells.item(1).innerHTML = user.chips_bought;
      row.cells.item(2).innerHTML = user.chips;
      row.cells.item(3).innerHTML =
        Number(user.chips) - Number(user.chips_bought);
    }
  }
};

export const hideModal = () => {
  $("#results-modal").modal("hide");
};

export const controlsDisableEnable = (turn, seatId) => {
  const takeCardBtn = document.getElementById("take-card");
  const skipTurnBtn = document.getElementById("skip-turn-btn");
  if (turn !== seatId) {
    takeCardBtn.disabled = true;
    skipTurnBtn.disabled = true;
  } else {
    takeCardBtn.disabled = false;
    skipTurnBtn.disabled = false;
  }
};

let timerInterval;

export const startTimer = () => {
  const timer = document.getElementById("timer");
  timer.hidden = false;
  timer.innerHTML = "10";
  let counter = 10;
  const timerInterval = setInterval(() => {
    counter--;
    timer.innerHTML = counter;
    if (counter === 0) {
      clearInterval(timerInterval);
      timer.innerHTML = "";
    }
  }, 1000);
};

export const stopTimer = () => {
  clearInterval(timerInterval);
  const timer = document.getElementById("timer");
  timer.hidden = true;
  timer.innerHTML = "";
  console.log("cleared", timerInterval);
};
