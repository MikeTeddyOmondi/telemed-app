const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const loginSubmitButton = document.getElementById("loginSubmitButton");

form.addEventListener("submit", login);

async function login(event) {
  event.preventDefault();

  loginSubmitButton.setAttribute("aria-busy", true);

  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  if (!email || !password) {
    console.error("Email/password cannot be empty!");
    errorMsg.textContent = "Email/password cannot be empty!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    loginSubmitButton.setAttribute("aria-busy", false);
    return;
  }

  try {
    const data = {
      email,
      password,
    };

    // send POST req
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const loginResult = await response.json();

    if (response.ok && loginResult.success) {
      localStorage.setItem("accountId", loginResult.data.accountId);
      // check for RBAC access to redirect to doctor's or admin console
      try {
        // check user profile
        const response = await fetch(
          `/api/users/${loginResult.data.accountId}/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { data: profile } = await response.json();

        if (profile.role === "admin") {
          window.location.href = `/admin-console`;
          return;
        } else if (profile.role === "doctor") {
          window.location.href = `/appointments`;
          return;
        } else {
          window.location.href = `/console`;
          return;
        }
      } catch (error) {
        console.error({ login_error: error });
        throw new Error(error.message);
      }
    } else if (response.status === 400) {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      loginSubmitButton.setAttribute("aria-busy", false);
      return;
    } else if (response.status === 500) {
      // response is not ok && result.success is false
      errorMsg.textContent = result.error;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      loginSubmitButton.setAttribute("aria-busy", false);
      return;
    }
  } catch (error) {
    // Server error
    errorMsg.textContent = "Something went wrong!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    loginSubmitButton.setAttribute("aria-busy", false);
    return;
  } finally {
    loginSubmitButton.setAttribute("aria-busy", false);
  }
}

function removeErrorMsg() {
  errorMsg.style.display = "none";
}
