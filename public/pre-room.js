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

//ERROR MESSAGES
const createInvalidName = document.getElementById("create-name-invalid");
const createInvalidPassword = document.getElementById(
  "create-password-invalid"
);
const createInvalidChips = document.getElementById("create-chips-invalid");
const joinInvalidName = document.getElementById("join-name-invalid");
const joinInvalidPassword = document.getElementById("join-password-invalid");
const joinInvalidChips = document.getElementById("join-chips-invalid");

//FORM ELEMENTS
const createFormName = document.getElementById("create-name");
const createFormPassword = document.getElementById("create-password");
const createFormChips = document.getElementById("create-chips");
const joinFormName = document.getElementById("join-name");
const joinFormPassword = document.getElementById("join-password");
const joinFormChips = document.getElementById("join-chips");

//AJAX FUNCTIONS
const showCreateForm = () => {
  mainForms.hidden = true;
  createForm.hidden = false;
};

const showJoinForm = () => {
  mainForms.hidden = true;
  joinForm.hidden = false;
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

    console.log(data);

    checkBlanks(
      name,
      password,
      chips,
      createInvalidName,
      createFormName,
      joinInvalidPassword,
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
    const data = {
      name,
      password,
      chips,
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

    if (name !== "" && password !== "" && chips !== "") {
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