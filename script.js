function handleSignup() {
  window.location.href = "./signup.html";
}
function handleLogin() {
  window.location.href = "./index.html";
}

function handleUserValidation(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (email === "vasanth.vkrs@gmail.com" && password === "@12345") {
    window.location.href = "./home.html";
  } else {
    alert("Wrong Credentials");
  }
}

function handleLogin(event) {
  event.preventDefault();
  alert("Sorry!, Server Error Try again later...");
}
