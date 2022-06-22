const mainForms = document.getElementById("create-or-join");
// BUTTONS
const showCreateRoomBtn = document.getElementById("get-create-room");
const showJoinRoomBtn = document.getElementById("get-join-room");
const createRoomBtn = document.getElementById("create-room-btn");
const joinRoomBtn = document.getElementById("join-room-btn");

//SECTIONS
const seatsBefore = document.getElementById("seats-bef");
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

//AJAX FUNCTIONS
const showCreateForm = () => {
  mainForms.hidden = true;
  createForm.hidden = false;
};

const showJoinForm = () => {
  mainForms.hidden = true;
  joinForm.hidden = false;
};

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
          createForm.hidden = true;
          seatsBefore.hidden = false;
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
          joinForm.hidden = true;
          seatsBefore.hidden = false;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

createRoomBtn.addEventListener("click", createRoom);
joinRoomBtn.addEventListener("click", joinRoom);
showCreateRoomBtn.addEventListener("click", showCreateForm);
showJoinRoomBtn.addEventListener("click", showJoinForm);

const allSeats = document.getElementsByClassName("seats");

Array.from(allSeats).forEach((btn) => {
  btn.addEventListener("click", function assignSeat(event) {
    const seatId = Number(this.id.slice(-1));
    console.log(seatId);
    try {
      const data = {
        seatId,
      };
      // axios.put("/game/seat", data).then((response) => {

      const afterseating = document.getElementById("seats-after");
      afterseating.hidden = false;
      seatsBefore.hidden = true;

      // });
    } catch (error) {}
  });
});
