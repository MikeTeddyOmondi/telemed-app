const errorMsg = document.getElementById("errorMsg");
const newContactForm = document.getElementById("newContactForm");

newContactForm.addEventListener("submit", handleContactSubmission);

async function handleContactSubmission(event) {
  event.preventDefault();
  let formData = Object.fromEntries(new FormData(newContactForm));

  // Validating for errors
  const { firstName, lastName, email, phoneNumber, message } = formData;
  if (!firstName || !lastName || !email || !phoneNumber || !message) {
    console.error("Please fill in all the details!");
    showErrorMessage("Please fill in all the details!");
    return;
  }

  try {
    // send data to our API
    const response = await fetch("/api/new-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log({ result });
    }

    showSuccessMsg(`
      Thanks for contacting us!
      Contact ID: ${result.data.contactId}
    `);
    newContactForm.reset();
  } catch (error) {
    showErrorMessage(error.message);
  }
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
  // spanMsg.style.display = "none";
}
