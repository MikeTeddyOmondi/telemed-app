const form = document.getElementById("registerForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", register);

async function register(event) {
  event.preventDefault();

  const username = document.getElementById("usernameInput").value;
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;

  console.log({ username, email, password, confirmPassword });

  // checked for empty inputs
  if (!username || !email || !password || !confirmPassword) {
    errorMsg.textContent = "Please enter all fields!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    return;
  }

  // Check if email is a valid email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMsg.textContent = "Please enter a correct email!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    return;
  }

  // Check the passwords match
  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords don't match!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    return;
  }

  // check password length
  if (password.length < 8) {
    errorMsg.textContent = "Please enter a correct password";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
  }

  // Interact w/ the users signup API
  // Make a POST request to our API endpoint
  // http://localhost:3377/api/user/signup

  try {
    const data = {
      username,
      email,
      password,
    };

    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      window.location.href = "/profile";
      return;
    } else if (response.status === 400) {
      // response is not ok && result.success is false
      errorMsg.textContent = result.error;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      return;
    } else if (response.status === 500) {
      // response is not ok && result.success is false
      errorMsg.textContent = result.error;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      return;
    }
  } catch (error) {
    // Server error
    errorMsg.textContent = "Something went wrong!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    return;
  }
}

function removeErrorMsg() {
  errorMsg.style.display = "none";
}
