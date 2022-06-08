const validationTypes = {
  emptyValidation: {
    emailvalid: "",
    emailfeedback: "",
    pwvalid: "",
    pwfeedback: "",
  },
  passwordIncorrect: {
    emailvalid: "",
    emailfeedback: "",
    pwvalid: "is-invalid",
    pwfeedback: "Incorrect Password",
  },
  noUser: {
    emailvalid: "is-invalid",
    emailfeedback: "User does not exist",
    pwvalid: "",
    pwfeedback: "",
  },
  userExists: {
    emailvalid: "is-invalid",
    emailfeedback: "Email already exists",
    pwvalid: "",
    pwfeedback: "",
  },
};

export default validationTypes;
