const errorMsg = document.getElementById("errorMsg");
const form = document.getElementById("deleteUserProfileForm");

form.addEventListener("submit", deleteUserProfile);

async function deleteUserProfile(event) {
  event.preventDefault();
  try {
    const accountId = localStorage.getItem("accountId");
    const response = await fetch(`/api/users/${accountId}/profile`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();

    if (response.ok && result.success) {
      setTimeout(removeErrorMsg, 3000);
      window.location.href = "/"
      return;
    } else if (response.status === 400 && response.status === 500) {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      return;
    } else {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
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
