import { toggleValidity } from "./helper.js";
function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context("../images/", true, /\.jpg\.svg\.png$/));

// LOGIN FORM ELEMENTS
const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const loginEmailFeedback = document.getElementById("login-email-feedback");
const loginPasswordFeedback = document.getElementById(
  "login-password-feedback"
);

// SIGNUP FORM ELEMENTS
const signupForm = document.getElementById("signup-form");
const signupName = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupBtn = document.getElementById("signup-btn");
const signupEmailFeedback = document.getElementById("signup-email-feedback");
const signupPasswordFeedback = document.getElementById(
  "signup-password-feedback"
);

//LANDING PAGE ELEMENTS
const landingPage = document.getElementById("landing");
const getStarted = document.getElementById("get-started");
getStarted.addEventListener("click", function() {
  loginForm.hidden = false;
  landingPage.hidden = true;
});

//To toggle between the pages: from login to sign up
const getSignupPage = document.getElementById("get-signup-form");
getSignupPage.addEventListener("click", function() {
  signupForm.hidden = false;
  loginForm.hidden = true;
  landingPage.hidden = true;
});

//To toggle between the pages: from signup to login
const getLoginPage = document.getElementById("get-login-form");
getLoginPage.addEventListener("click", function() {
  window.location.reload();
  signupForm.hidden = true;
  loginForm.hidden = false;
  landingPage.hidden = true;
});

//LOGIN FUNCTIONS
const postLogin = () => {
  try {
    const email = loginEmail.value;
    const password = loginPassword.value;
    const data = {
      email,
      password,
    };

    console.log(data);

    if (email === "") {
      loginEmailFeedback.innerHTML = "Please input a valid name";
      toggleValidity(loginEmail, "invalid");
    } else if (password === "") {
      loginPasswordFeedback.innerHTML = "Please input a valid name";
      toggleValidity(loginPassword, "invalid");
    } else {
      axios.post("/login", data).then((response) => {
        if (response.data === "Email does not exists") {
          loginEmailFeedback.innerHTML = response.data;
          toggleValidity(loginEmail, "is-invalid");
        } else if (response.data === "Password is incorrect") {
          loginPasswordFeedback.innerHTML = response.data;
          toggleValidity(loginPassword, "is-invalid");
        } else {
          window.location.replace("http://localhost:3004/room");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//SIGNUP FUNCTIONS
const postSignup = () => {
  try {
    const username = signupName.value;
    const email = signupEmail.value;
    const password = signupPassword.value;

    const data = {
      username,
      email,
      password,
    };

    console.log(data);
    if (email === "") {
      signupEmailFeedback.innerHTML = "Please input a valid name";
      toggleValidity(signupEmail, "invalid");
    } else if (password === "") {
      signupPasswordFeedback.innerHTML = "Please input a valid name";
      toggleValidity(signupPassword, "invalid");
    } else if (username === "") {
      toggleValidity(signupName, "invalid");
    } else {
      axios.post("/signup", data).then((response) => {
        if (response.data === "User already exists") {
          signupEmailFeedback.innerHTML = response.data;
          toggleValidity(signupEmail, "is-invalid");
        } else {
          signupForm.hidden = true;
          loginForm.hidden = false;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

loginBtn.addEventListener("click", postLogin);
signupBtn.addEventListener("click", postSignup);
