const appointmentsRouter = require("express").Router();

const { pool } = require("../database/init");

appointmentsRouter.post("/", async function (req, res) {
  const { doctorId, appointmentDescription, dateInput } = req.body;

  if (!doctorId || !appointmentDescription || !dateInput)
    return res
      .status(400)
      .json({ success: false, error: "Please enter all fields!" });

  try {
    // check for appointment conflicts

  } catch (error) {
    console.log({ create_appointments_error: error.message });
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong!" });
  }
});

module.exports = appointmentsRouter;
