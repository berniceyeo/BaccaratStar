const mainForms = document.getElementById("create-or-join");
// BUTTONS
const showCreateRoomBtn = document.getElementById("get-create-room");
const showJoinRoomBtn = document.getElementById("get-join-room");
const createRoomBtn = document.getElementById("create-room-btn");

//SECTIONS
const seats = document.getElementById("seats");
const createForm = document.getElementById("create-room");
const joinForm = document.getElementById("join-room");

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
    const name = document.getElementById("create-name").value;
    const password = document.getElementById("create-password").value;
    const chips = document.getElementById("create-chips").value;
    const data = {
      name,
      password,
      chips,
    };
    console.log(data);
    axios.post("/game/create", data).then((response) => {
      createForm.hidden = true;
      seats.hidden = false;
    });
  } catch (error) {
    console.log(error);
  }
};

createRoomBtn.addEventListener("click", createRoom);
showCreateRoomBtn.addEventListener("click", showCreateForm);
showJoinRoomBtn.addEventListener("click", showJoinForm);
