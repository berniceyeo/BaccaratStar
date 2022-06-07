const generateButton = document.getElementById("generate-login");

// from the Main page, creates login in form for signing in
const generateLogin = () => {
  var sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";

  const html =
    '<form> <div class="mb-3">  <label for="email" class="form-label">Email address</label>  <input type="email" class="form-control" id="email" />  </div>   <div class="mb-3">  <label for="password" class="form-label">Password</label>  <input type="password" class="form-control" id="password" />  </div>  <button type="submit" class="main-btn">Submit</button> </form>';

  var newDiv = document.createElement("div");
  newDiv.classList.add("w-75");
  newDiv.innerHTML = html;
  sidebar.appendChild(newDiv);
};

generateButton.addEventListener("click", generateLogin);
