let profileData = {};
const errorMsg = document.getElementById("errorMsg");
const form = document.getElementById("appointmentForm");
const profileCard = document.getElementById("profileCard");
const editProfileSubmitButton = document.getElementById(
  "editProfileSubmitButton"
);

form.addEventListener("submit", editUserProfile);

async function fetchUserProfile() {
  profileCard.setAttribute("aria-busy", true);
  try {
    const accountId = localStorage.getItem("accountId");
    const response = await fetch(`/api/users/${accountId}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok && result.success) {
      profileData = result.data;
      document.getElementById("usernameInput").value = profileData.username;
      profileCard.textContent = JSON.stringify(result.data);
      profileCard.setAttribute("aria-busy", "false");
      return;
    } else if (response.status === 400 && response.status === 500) {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      profileCard.setAttribute("aria-busy", false);
      return;
    } else {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      profileCard.setAttribute("aria-busy", false);
      return;
    }
  } catch (error) {
    // Server error
    errorMsg.textContent = "Something went wrong!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    profileCard.setAttribute("aria-busy", false);
    return;
  } finally {
    profileCard.setAttribute("aria-busy", false);
  }
}

async function editUserProfile(event) {
  event.preventDefault();
  editProfileSubmitButton.setAttribute("aria-busy", true);
  const newUsername = document.getElementById("usernameInput").value;

  if (!newUsername) {
    console.error("Please fill in all the details!");
    errorMsg.textContent = "Please fill in all the details!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    editProfileSubmitButton.setAttribute("aria-busy", false);
    return;
  }

  const formData = {
    newUsername,
  };

  try {
    const accountId = localStorage.getItem("accountId");
    const response = await fetch(`/api/users/${accountId}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "green";
      errorMsg.style.display = "block";
      errorMsg.style.color = "black";
      editProfileSubmitButton.setAttribute("aria-busy", false);
      await fetchUserProfile();
      return;
    } else if (response.status === 400 || response.status === 500) {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      editProfileSubmitButton.setAttribute("aria-busy", false);
      return;
    } else {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      editProfileSubmitButton.setAttribute("aria-busy", false);
      return;
    }
  } catch (error) {
    console.log({ error });
    // Server error
    errorMsg.textContent = "Something went wrong!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    editProfileSubmitButton.setAttribute("aria-busy", false);
    return;
  } finally {
    editProfileSubmitButton.setAttribute("aria-busy", false);
    setTimeout(removeErrorMsg, 3000);
  }
}

function removeErrorMsg() {
  errorMsg.style.display = "none";
}

(async () => {
  await fetchUserProfile();
})();
