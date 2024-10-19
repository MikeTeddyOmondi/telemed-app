const appointmentsRouter = require("express").Router();

const { pool } = require("../database/init");
const apiAuth = require("../middlewares/apiAuth");

appointmentsRouter.get("/", apiAuth, async function (req, res) {
  const { userId } = req.session;
  try {
    const [appointmentsFound] = await pool().query(
      `SELECT appointment_id, 
        doctors.first_name as doctors_first_name, 
        appointments.appointment_date, 
        appointments_status.status_name as appointment_status 
      FROM appointments
      LEFT JOIN doctors
      ON appointments.doctor_id = doctors.doctor_id
      LEFT JOIN appointments_status
      ON appointments.appointment_status_id = appointments_status.status_id
      WHERE appointments.patient_id = ?`,
      [userId]
    );
    return res.status(200).json({
      success: true,
      message: `Appointments made by user: ${userId}!`,
      data: appointmentsFound,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
});

appointmentsRouter.post("/", apiAuth, async function (req, res) {
  const { userId } = req.session;
  const { doctorId, appointmentDescription, dateInput } = req.body;

  if (!doctorId || !appointmentDescription || !dateInput)
    return res
      .status(400)
      .json({ success: false, error: "Please enter all fields!" });

  try {
    // check for null rows | patient_id & doctor_id
    // Check if patient exists
    const [patientFound] = await pool().query(
      "SELECT 1 FROM patients WHERE patient_id = ?",
      [userId]
    );
    if (patientFound.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Patient does not exist" });
    }

    // Check if doctor exists
    const [doctorsFound] = await pool().query(
      "SELECT 1 FROM doctors WHERE doctor_id = ?",
      [doctorId]
    );
    if (doctorsFound.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Doctor does not exist" });
    }

    // appointments lasts for 30 mins
    // appointments can only be for future dates
    const [appointmentFound] = await pool().query(
      "SELECT * FROM appointments WHERE appointment_date = ?",
      [dateInput]
    );

    // check for appointment conflicts / if it exists
    const isAppointmentScheduled = appointmentFound.length > 0 ?? false;
    // console.log({ isAppointmentScheduled });

    if (isAppointmentScheduled)
      return res.status(500).json({
        success: false,
        message: "Appointment scheduled already for this date & time",
      });

    // insert appointment to db
    const [newAppointment] = await pool().query(
      "INSERT INTO appointments (doctor_id, patient_id, description, appointment_date) VALUES (?, ?, ?, ?)",
      [doctorId, userId, appointmentDescription, dateInput]
    );

    return res.status(201).json({
      success: true,
      message: `Appointment ID: ${newAppointment.insertId} made successfully!`,
    });
  } catch (error) {
    console.log({ create_appointments_error: error.message });
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
});

module.exports = appointmentsRouter;
