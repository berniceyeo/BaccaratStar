const mainForms = document.getElementById("create-or-join");
// BUTTONS
const showCreateRoomBtn = document.getElementById("get-create-room");
const showJoinRoomBtn = document.getElementById("get-join-room");
const createRoomBtn = document.getElementById("create-room-btn");

//SECTIONS
const seats = document.getElementById("seats");
const createForm = document.getElementById("create-room");
const joinForm = document.getElementById("join-room");

//ERROR MESSAGES
const createInvalidName = document.getElementById("create-name-invalid");
const createInvalidPassword = document.getElementById(
  "create-password-invalid"
);
const createInvalidChips = document.getElementById("create-chips-invalid");

//FORM ELEMENTS
const createFormName = document.getElementById("create-name");
const createFormPassword = document.getElementById("create-password");
const createFormChips = document.getElementById("create-chips");

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

    if (name === "") {
      createInvalidName.innerHTML = "Please input a valid name";
      createInvalidName.hidden = false;
      toggleValidity(createFormName, "invalid");
    } else {
      createInvalidName.hidden = true;
      toggleValidity(createFormName, "valid");
    }

    if (password === "") {
      createInvalidPassword.innerHTML = "Please input a valid password";
      createInvalidPassword.hidden = false;
      toggleValidity(createFormPassword, "invalid");
    } else {
      createInvalidPassword.hidden = true;
      toggleValidity(createFormPassword, "valid");
    }

    if (chips === "") {
      createInvalidChips.innerHTML = "Please input some chips you want to buy";
      createInvalidChips.hidden = false;
      toggleValidity(createFormChips, "invalid");
    } else {
      createInvalidChips.hidden = true;
      toggleValidity(createFormChips, "valid");
    }

    if (name !== "" && password !== "" && chips !== "") {
      axios.post("/game/create", data).then((response) => {
        if (response.data.message === "room name is not unique") {
          createInvalidName.innerHTML =
            "Name not unique, please use different name";
          createInvalidName.hidden = false;
          toggleValidity(createFormName, "invalid");
        } else {
          createForm.hidden = true;
          seats.hidden = false;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

createRoomBtn.addEventListener("click", createRoom);
showCreateRoomBtn.addEventListener("click", showCreateForm);
showJoinRoomBtn.addEventListener("click", showJoinForm);
