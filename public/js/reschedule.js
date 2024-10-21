const rescheduleForm = document.getElementById("rescheduleAppointmentForm");
const editDoctorSelect = document.getElementById("editDoctorId");
const editErrorMsg = document.getElementById("editErrorMsg");
const editAppointmentSubmitButton = document.getElementById(
  "editAppointmentSubmitButton"
);

rescheduleForm.addEventListener("submit", rescheduleAppointment);

async function fetchCurrentAppointment() {
  const appointmentId = getQueryParam("appointmentId");
  try {
    // fetch appointment
    const response = await fetch(`/api/appointments/${appointmentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // adds session cookies to the request
    });

    const result = await response.json();

    if (response.ok && result.success) {
      populateRescheduleForm(result.data);
      return;
    } else if (response.status === 400 && response.status === 500) {
      // response is not ok && result.success is false
      editErrorMsg.textContent = result.message;
      editErrorMsg.style.backgroundColor = "pink";
      editErrorMsg.style.display = "block";
      editErrorMsg.style.color = "red";
      return;
    } else {
      // response is not ok && result.success is false
      editErrorMsg.textContent = result.message;
      editErrorMsg.style.backgroundColor = "pink";
      editErrorMsg.style.display = "block";
      editErrorMsg.style.color = "red";
      return;
    }
  } catch (error) {
    console.log({ fetchAppointments: error });
    // Server error
    editErrorMsg.textContent = "Something went wrong!";
    editErrorMsg.style.backgroundColor = "pink";
    editErrorMsg.style.display = "block";
    editErrorMsg.style.color = "red";
    return;
  }
}

async function rescheduleAppointment(event) {
  event.preventDefault();
  editAppointmentSubmitButton.setAttribute("aria-busy", true);

  const doctorId = editDoctorSelect.value;
  const appointmentId = document.getElementById("appointmentId").value;
  const dateInput = document.getElementById("editDateInput").value;
  const timeInput = document.getElementById("editTimeInput").value;
  const appointmentDescription = document.getElementById(
    "editDescriptionInput"
  ).value;

  if (!dateInput || !timeInput || !appointmentDescription) {
    console.error("Please fill in all the details!");
    editErrorMsg.textContent = "Please fill in all the details!";
    editErrorMsg.style.backgroundColor = "pink";
    editErrorMsg.style.display = "block";
    editErrorMsg.style.color = "red";
    editAppointmentSubmitButton.setAttribute("aria-busy", false);
    setTimeout(removeErrorMsg, 3000);
    return;
  }

  const formData = {
    doctorId,
    appointmentDescription,
    dateInput,
    timeInput,
  };
  console.log({ formData });

  try {
    // send PUT req
    // http://localhost:3377/api/appointments/:appointmentId
    const response = await fetch(`/api/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      editErrorMsg.textContent = result.message;
      editErrorMsg.style.backgroundColor = "green";
      editErrorMsg.style.display = "block";
      editErrorMsg.style.color = "black";
      await fetchCurrentAppointment();
      editAppointmentSubmitButton.setAttribute("aria-busy", false);
      rescheduleForm.reset();
      setTimeout(() => {
        removeErrorMsg();
        goTo("/console");
      }, 4000);
      return;
    } else if (response.status === 400 && response.status === 500) {
      // response is not ok && result.success is false
      editErrorMsg.textContent = result.message;
      editErrorMsg.style.backgroundColor = "pink";
      editErrorMsg.style.display = "block";
      editErrorMsg.style.color = "red";
      editAppointmentSubmitButton.setAttribute("aria-busy", false);
      setTimeout(removeErrorMsg, 3000);
      return;
    } else {
      // response is not ok && result.success is false
      editErrorMsg.textContent = result.message;
      editErrorMsg.style.backgroundColor = "pink";
      editErrorMsg.style.display = "block";
      editErrorMsg.style.color = "red";
      editAppointmentSubmitButton.setAttribute("aria-busy", false);
      setTimeout(removeErrorMsg, 3000);
      return;
    }
  } catch (error) {
    console.log({ error });
    // Server error
    editErrorMsg.textContent = "Something went wrong!";
    editErrorMsg.style.backgroundColor = "pink";
    editErrorMsg.style.display = "block";
    editErrorMsg.style.color = "red";
    editAppointmentSubmitButton.setAttribute("aria-busy", false);
    setTimeout(removeErrorMsg, 3000);
    return;
  } finally {
    editAppointmentSubmitButton.setAttribute("aria-busy", false);
    setTimeout(removeErrorMsg, 3000);
  }
}

// Function to populate the form with fetched data
function populateRescheduleForm([data]) {
  // Get form fields
  const appointmentId = document.getElementById("appointmentId");
  const dateInput = document.getElementById("editDateInput");
  const timeInput = document.getElementById("editTimeInput");
  const appointmentDescription = document.getElementById(
    "editDescriptionInput"
  );
  const formattedDate = formatDate(data.appointment_date);

  // Populate form fields with data
  appointmentId.value = data.appointment_id;
  populateSelect(data.doctor_id, data.doctors_first_name);
  dateInput.value = formattedDate;
  timeInput.value = data.appointment_time;
  appointmentDescription.value = data.description;
}

function populateSelect(doctorId, doctorName) {
  const option = document.createElement("option");
  option.value = doctorId;
  option.textContent = doctorName;
  editDoctorSelect.appendChild(option);
}

// Function to format the date to MM/DD/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed)
  const day = String(date.getDate()).padStart(2, "0"); // Get day
  const year = date.getFullYear(); // Get full year

  return `${year}-${month}-${day}`;
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function removeErrorMsg() {
  editErrorMsg.style.display = "none";
}

(async () => {
  await fetchCurrentAppointment();
})();
