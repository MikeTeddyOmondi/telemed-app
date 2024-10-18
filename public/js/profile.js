const form = document.getElementById("appointmentForm");
const profileCard = document.getElementById("profileCard");
const doctorSelect = document.getElementById("doctorId");
const appointmentSubmitButton = document.getElementById(
  "appointmentSubmitButton"
);

form.addEventListener("submit", createAppointment);

async function fetchUserProfile() {
  profileCard.setAttribute("aria-busy", true);
  // Make a GET request to our API endpoint
  // http://localhost:3377/api/user/profile
  try {
    // send POST req
    const response = await fetch("/api/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok && result.success) {
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

async function fetchDoctors() {
  // fetch doctors
  // Make a GET request to our API endpoint
  // http://localhost:3377/api/doctors
  try {
    // send GET req
    const response = await fetch("/api/doctors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // adds session cookies to the request
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Populate the select element
      populateSelectWithDoctors(result.data);
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

async function userAppointments() {
  // fetch user appointments
}

async function createAppointment(event) {
  event.preventDefault();

  appointmentSubmitButton.setAttribute("aria-busy", true);

  const doctorId = document.getElementById("doctorId").value;
  const dateInput = document.getElementById("dateInput").value;
  const timeInput = document.getElementById("timeInput").value;
  const appointmentDescription =
    document.getElementById("descriptionInput").value;

  if (!doctorId || !dateInput || !timeInput || !appointmentDescription) {
    console.error("Please fill in all the details!");
    errorMsg.textContent = "Please fill in all the details!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    appointmentSubmitButton.setAttribute("aria-busy", false);
    return;
  }

  const formData = {
    doctorId,
    appointmentDescription,
    dateInput,
    timeInput,
  };
  console.log({ formData });

  // Make a GET request to our API endpoint
  // http://localhost:3377/api/appointments/
  try {
    // send POST req
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "lime";
      errorMsg.style.display = "block";
      errorMsg.style.color = "black";
      appointmentSubmitButton.setAttribute("aria-busy", false);
      return;
    } else if (response.status === 400 && response.status === 500) {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      appointmentSubmitButton.setAttribute("aria-busy", false);
      return;
    } else {
      // response is not ok && result.success is false
      errorMsg.textContent = result.message;
      errorMsg.style.backgroundColor = "pink";
      errorMsg.style.display = "block";
      errorMsg.style.color = "red";
      appointmentSubmitButton.setAttribute("aria-busy", false);
      return;
    }
  } catch (error) {
    console.log({ error });
    // Server error
    errorMsg.textContent = "Something went wrong!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    appointmentSubmitButton.setAttribute("aria-busy", false);
    return;
  } finally {
    appointmentSubmitButton.setAttribute("aria-busy", false);
  }
}

// populate select element with doctors
function populateSelectWithDoctors(doctors) {
  // Clear existing options
  doctorSelect.innerHTML = "";

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select your care doctor...";
  defaultOption.value = "";
  defaultOption.attributes.selected = true;
  defaultOption.attributes.disabled = true;
  doctorSelect.add(defaultOption);

  // Add an option for each doctor
  doctors.forEach((doctor) => {
    const option = document.createElement("option");
    option.value = doctor.doctor_id;
    option.text = doctor.first_name;
    doctorSelect.add(option);
  });
}

function removeErrorMsg() {
  errorMsg.style.display = "none";
}

(async () => {
  await fetchUserProfile();
  await fetchDoctors();
})();
