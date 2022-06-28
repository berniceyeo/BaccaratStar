//HELPER FUNCIONS
const toggleValidity = (element, validity) => {
  if (validity === "valid") {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
  }
};

const checkBlanks = (
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
const reshuffleSeats = (seatId) => {
  const restOfSeats = document.getElementsByClassName("seated");
  console.log(restOfSeats);
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
const displayCardsPoints = (data) => {
  let sum = 0;
  let stringSum;
  for (let i = 1; i < 3; i++) {
    sum += data[i - 1].points;
    stringSum = String(sum).slice(-1);
    const card = document.getElementById(`main-seat-${i}`);
    card.innerHTML = "";
    const image = document.createElement("img");
    card.style.backgroundImage = `url(${data[i - 1].pic})`;
  }
  const points = document.getElementById("points");
  points.innerHTML = `Points: ${stringSum}`;
  gameStartBtn.hidden = true;
  controls.hidden = false;
  takeCardBtn.disabled = false;
};