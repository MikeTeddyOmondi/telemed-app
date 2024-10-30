const spanMsg = document.getElementById("spanMsg");
const errorMsg = document.getElementById("errorMsg");
const form = document.getElementById("addProviderForm");
const doctorSelect = document.getElementById("doctorId");
const appointmentSubmitButton = document.getElementById(
  "appointmentSubmitButton"
);
const appointmentsTable = document.getElementById("appointments-table");
let appointments = JSON.parse(localStorage.getItem("appointments")) ?? [];

form.addEventListener("submit", createProvider);

async function fetchDoctors() {
  try {
    const accountId = localStorage.getItem("accountId");
    const response = await fetch(`/api/${accountId}/doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // adds session cookies to the request
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Populate the select element
      // populateSelectWithDoctors(result.data);
      // populateEditSelectWithDoctors(result.data);
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

async function fetchUserAppointments() {
  try {
    const accountId = localStorage.getItem("accountId");
    const response = await fetch(`/api/${accountId}/appointments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // adds session cookies to the request
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Populate the appointments table
      showAppointments(appointmentsTable, result.data);
      // populateRescheduleForm(result.data);
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
    console.log({ fetchAppointments: error });
    // Server error
    errorMsg.textContent = "Something went wrong!";
    errorMsg.style.backgroundColor = "pink";
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    return;
  }
}

async function createProvider(event) {
  event.preventDefault();

  appointmentSubmitButton.setAttribute("aria-busy", true);

  const username = document.getElementById("username").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const primaryEmail = document.getElementById("primaryEmail").value;
  const secondaryEmail = document.getElementById("secondaryEmail").value;
  const password = document.getElementById("password").value;
  const specialty = document.getElementById("specialty").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const dateJoined = document.getElementById("dateJoined").value;

  if (
    !username ||
    !firstName ||
    !lastName ||
    !primaryEmail ||
    !secondaryEmail ||
    !password ||
    !specialty ||
    !phoneNumber ||
    !dateJoined
  ) {
    console.error("Please fill in all the details!");
    showErrorMessage("Please fill in all the details!");
    appointmentSubmitButton.setAttribute("aria-busy", false);
    return;
  }

  const formData = {
    username,
    firstName,
    lastName,
    primaryEmail,
    secondaryEmail,
    password,
    specialty,
    phoneNumber,
    dateJoined,
  };
  console.log({ formData });

  try {
    const accountId = localStorage.getItem("accountId");
    const response = await fetch(`/api/${accountId}/doctors/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      appointmentSubmitButton.setAttribute("aria-busy", false);
      form.reset();
      showSuccessMsg(result.message);
      await fetchUserAppointments();
      return;
    } else if (response.status === 400 && response.status === 500) {
      appointmentSubmitButton.setAttribute("aria-busy", false);
      showErrorMessage(result.error.message);
      return;
    } else {
      appointmentSubmitButton.setAttribute("aria-busy", false);
      showErrorMessage(result.error.message);
      return;
    }
  } catch (error) {
    console.log({ error });
    // Server error
    appointmentSubmitButton.setAttribute("aria-busy", false);
    showErrorMessage("Something went wrong!");
    return;
  } finally {
    appointmentSubmitButton.setAttribute("aria-busy", false);
    setTimeout(removeErrorMsg, 3000);
  }
}

async function cancelAppointment(appointmentId) {
  try {
    const accountId = localStorage.getItem("accountId");
    const response = await fetch(
      `/api/${accountId}/appointments/${appointmentId}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      spanMsg.textContent = result.message;
      spanMsg.style.backgroundColor = "green";
      spanMsg.style.display = "block";
      spanMsg.style.color = "black";
      await fetchUserAppointments();
      setTimeout(removeErrorMsg, 3000);
      return;
    } else if (response.status === 400 && response.status === 500) {
      // response is not ok && result.success is false
      spanMsg.textContent = result.message;
      spanMsg.style.backgroundColor = "pink";
      spanMsg.style.display = "block";
      spanMsg.style.color = "red";
      setTimeout(removeErrorMsg, 3000);
      return;
    } else {
      // response is not ok && result.success is false
      spanMsg.textContent = result.message;
      spanMsg.style.backgroundColor = "pink";
      spanMsg.style.display = "block";
      spanMsg.style.color = "red";
      setTimeout(removeErrorMsg, 3000);
      return;
    }
  } catch (error) {
    console.log({ error });
    // Server error
    spanMsg.textContent = "Something went wrong!";
    spanMsg.style.backgroundColor = "pink";
    spanMsg.style.display = "block";
    spanMsg.style.color = "red";
    setTimeout(removeErrorMsg, 3000);
    return;
  } finally {
    setTimeout(removeErrorMsg, 3000);
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

// populate table with user appointments
const showAppointments = (appointmentsTable, appointments) => {
  appointmentsTable.innerHTML = "";
  for (let i = 0; i < appointments.length; i++) {
    appointmentsTable.innerHTML += `
      <tr>
      <td>${appointments[i].appointment_id}</td>
        <td>${appointments[i].doctors_first_name}</td>
        <td>${new Date(
          appointments[i].appointment_date
        ).toLocaleDateString()}</td>
        <td>${appointments[i].appointment_time}</td>
        <td><kbd>${appointments[i].appointment_status}</kbd></td>
        <td>         
          <a class="editButton" onclick="goTo('/reschedule?appointmentId=${
            appointments[i].appointment_id
          }')"><img src="/static/assets/edit.svg" alt="reschedule-appointment" />
          </a>          
          <a class="deleteButton" onclick="cancelAppointment(${
            appointments[i].appointment_id
          })"><img src="/static/assets/delete.svg" alt="cancel-appointment" />
          </a>
        </td>
      </tr>
    `;
  }
};

function populateSelect(doctorId, doctorName) {
  const option = document.createElement("option");
  option.value = doctorId;
  option.textContent = doctorName;
  editDoctorSelect.appendChild(option);
}

function showSuccessMsg(message) {
  errorMsg.textContent = message;
  errorMsg.style.backgroundColor = "green";
  errorMsg.style.display = "block";
  errorMsg.style.color = "black";
  setTimeout(removeErrorMsg, 3000);
}

function showErrorMessage(message) {
  errorMsg.textContent = message;
  errorMsg.style.backgroundColor = "pink";
  errorMsg.style.display = "block";
  errorMsg.style.color = "red";
  setTimeout(removeErrorMsg, 3000);
}

function removeErrorMsg() {
  errorMsg.style.display = "none";
  spanMsg.style.display = "none";
}

(async () => {
  await fetchUserAppointments();
  await fetchDoctors();
})();
