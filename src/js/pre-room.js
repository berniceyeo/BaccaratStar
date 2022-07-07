// IMPORT
import { checkBlanks, toggleValidity } from "./helper.js";
function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context("../images/", true, /\.jpg\.svg\.png$/));

// BUTTONS
const showCreateRoomBtn = document.getElementById("get-create-room");
const showJoinRoomBtn = document.getElementById("get-join-room");
const createRoomBtn = document.getElementById("create-room-btn");
const joinRoomBtn = document.getElementById("join-room-btn");

//SECTIONS
const mainForms = document.getElementById("create-or-join");
const mainSeat = document.getElementById("main-seat");
const createForm = document.getElementById("create-room");
const joinForm = document.getElementById("join-room");
const navUsername = document.getElementById("navbarDropdown");

//ERROR MESSAGES
const createInvalidName = document.getElementById("create-name-invalid");
const createInvalidPassword = document.getElementById(
  "create-password-invalid"
);
const createInvalidChips = document.getElementById("create-chips-invalid");
const createInvalidBet = document.getElementById("create-bet-invalid");
const joinInvalidName = document.getElementById("join-name-invalid");
const joinInvalidPassword = document.getElementById("join-password-invalid");
const joinInvalidChips = document.getElementById("join-chips-invalid");
const joinInvalidBet = document.getElementById("join-bet-invalid");

//FORM ELEMENTS
const createFormName = document.getElementById("create-name");
const createFormPassword = document.getElementById("create-password");
const createFormChips = document.getElementById("create-chips");
const createFormBet = document.getElementById("create-bet");
const joinFormName = document.getElementById("join-name");
const joinFormPassword = document.getElementById("join-password");
const joinFormChips = document.getElementById("join-chips");
const joinFormBet = document.getElementById("join-bet");

//AJAX FUNCTIONS
const showMain = () => {
  mainForms.hidden = false;
  joinForm.hidden = true;
  createForm.hidden = true;
};
const showCreateForm = () => {
  mainForms.hidden = true;
  joinForm.hidden = true;
  createForm.hidden = false;
};

const showJoinForm = () => {
  mainForms.hidden = true;
  createForm.hidden = true;
  joinForm.hidden = false;
};

const logout = async () => {
  const response = await axios.post("/logout");
  if (response.data === "logout") {
    window.location.replace("http://localhost:3004");
  }
};

const init = async () => {
  const response = await axios.get("/game/userstate");
  const name = response.data.username;
  if (name !== null || undefined) {
    navUsername.innerHTML = name;
  }
};

// create room jumps straight to the room, as the user cannot choose his seat.
const createRoom = () => {
  try {
    const name = createFormName.value;
    const password = createFormPassword.value;
    const chips = createFormChips.value;
    const data = {
      name,
      password,
      chips,
    };

    checkBlanks(
      name,
      password,
      chips,
      createInvalidName,
      createFormName,
      createInvalidPassword,
      createFormPassword,
      createInvalidChips,
      createFormChips
    );

    if (name !== "" && password !== "" && chips !== "") {
      axios.post("/game/create", data).then((response) => {
        if (response.data.message === "room name is not unique") {
          createInvalidName.innerHTML =
            "Name not unique, please use different name";
          createInvalidName.hidden = false;
          toggleValidity(createFormName, "invalid");
        } else {
          window.location.replace("http://localhost:3004/game");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const joinRoom = () => {
  try {
    const name = joinFormName.value;
    const password = joinFormPassword.value;
    const chips = joinFormChips.value;
    const bet = joinFormBet.value;
    const data = {
      name,
      password,
      chips,
      bet,
    };

    checkBlanks(
      name,
      password,
      chips,
      joinInvalidName,
      joinFormName,
      joinInvalidPassword,
      joinFormPassword,
      joinInvalidChips,
      joinFormChips
    );

    if (bet === "") {
      joinInvalidBet.innerHTML = "Please input the bet you want";
      joinInvalidBet.hidden = false;
      toggleValidity(joinFormBet, "invalid");
    } else {
      joinInvalidBet.hidden = true;
      toggleValidity(joinFormBet, "valid");
    }

    if (name !== "" && password !== "" && chips !== "" && bet !== "") {
      axios.post("/game/join", data).then((response) => {
        if (response.data.message === "No such room exists") {
          joinInvalidName.innerHTML =
            "Rooms is not found, please enter valid room";
          joinInvalidName.hidden = false;
          toggleValidity(joinFormName, "invalid");
        } else if (response.data.message === "Incorrect Password") {
          joinInvalidPassword.innerHTML = "Please enter correct password";
          joinInvalidPassword.hidden = false;
          toggleValidity(joinFormPassword, "invalid");
        } else {
          window.location.replace("http://localhost:3004/game");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// BUTTONS EVENTS
createRoomBtn.addEventListener("click", createRoom);
joinRoomBtn.addEventListener("click", joinRoom);
showCreateRoomBtn.addEventListener("click", showCreateForm);
showJoinRoomBtn.addEventListener("click", showJoinForm);
document
  .getElementById("nav-show-create")
  .addEventListener("click", showCreateForm);
document
  .getElementById("nav-show-join")
  .addEventListener("click", showJoinForm);
document.getElementById("nav-show-main").addEventListener("click", showMain);
document.getElementById("nav-logout").addEventListener("click", logout);
init();
