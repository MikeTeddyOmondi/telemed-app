const appointmentsRouter = require("express").Router();

const { pool } = require("../database/init");
const apiAuth = require("../middlewares/apiAuth");

appointmentsRouter.get("/", async function (req, res) {
  const { userId } = req.userInfo;
  try {
    const [appointmentsFound] = await pool().query(
      `SELECT 
        appointment_id,
        appointments.doctor_id, 
        doctors.first_name as doctors_first_name, 
        appointments.description, 
        appointments.appointment_date, 
        appointments.appointment_time, 
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
    console.error({ get_appointments_error: error.message });
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
});

appointmentsRouter.get("/:appointmentId", async function (req, res) {
  const { userId } = req.userInfo;
  const { appointmentId } = req.params;
  try {
    const [appointmentFound] = await pool().query(
      `SELECT 
        appointment_id,
        appointments.doctor_id, 
        doctors.first_name as doctors_first_name, 
        appointments.description, 
        appointments.appointment_date, 
        appointments.appointment_time, 
        appointments_status.status_name as appointment_status 
      FROM appointments
      LEFT JOIN doctors
      ON appointments.doctor_id = doctors.doctor_id
      LEFT JOIN appointments_status
      ON appointments.appointment_status_id = appointments_status.status_id
      WHERE appointments.patient_id = ?
      AND appointments.appointment_id = ?;`,
      [userId, appointmentId]
    );
    return res.status(200).json({
      success: true,
      message: `Appointments made by user: ${userId}!`,
      data: appointmentFound,
    });
  } catch (error) {
    console.error({ get_appointments_error: error.message });
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
});

appointmentsRouter.post("/", async function (req, res) {
  const { userId } = req.userInfo;
  const { doctorId, appointmentDescription, dateInput, timeInput } = req.body;

  if (!doctorId || !appointmentDescription || !dateInput || !timeInput)
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
      "INSERT INTO appointments (doctor_id, patient_id, description, appointment_date, appointment_time) VALUES (?, ?, ?, ?, ?)",
      [doctorId, userId, appointmentDescription, dateInput, timeInput]
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

appointmentsRouter.put("/:appointmentId", async function (req, res) {
  // const { userId } = req.userInfo;
  const { appointmentId } = req.params;
  const { doctorId, appointmentDescription, dateInput, timeInput } = req.body;

  if (!doctorId || !appointmentDescription || !dateInput || !timeInput)
    return res
      .status(400)
      .json({ success: false, error: "Please enter all fields!" });

  try {
    // check for null rows | patient_id & doctor_id
    // Check if appointment_id exists
    const [appointmentRecordFound] = await pool().query(
      "SELECT * FROM appointments WHERE appointment_id = ?",
      [appointmentId]
    );

    if (appointmentRecordFound < 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment record not found",
      });
    }

    const [appointmentsFound] = await pool().query(
      `SELECT * 
        FROM appointments 
        WHERE appointment_date = ? 
        AND appointment_time = ? 
        AND doctor_id = ? 
        AND appointment_id != ?`,
      [dateInput, timeInput, doctorId, appointmentId]
    );
    console.log({ appointmentsFound });

    // check for appointment time conflicts with another / if it exists
    const isAppointmentScheduled = appointmentsFound.length > 0 ?? false;

    if (isAppointmentScheduled)
      return res.status(500).json({
        success: false,
        message:
          "Appointment already scheduled. Please choose a different time!",
      });

    // Update appointment in the db
    const [_updatedAppointment] = await pool().query(
      `UPDATE appointments 
        SET description = ?,  
            appointment_date = ?, 
            appointment_time = ?,
            appointment_status_id = 1 
        WHERE appointment_id = ?`,
      [appointmentDescription, dateInput, timeInput, appointmentId]
    );

    return res.status(200).json({
      success: true,
      message: `Appointment rescheduled successfully!`,
    });
  } catch (error) {
    console.log({ update_appointments_error: error.message });
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
});

appointmentsRouter.put(
  "/:appointmentId/cancel",
  apiAuth,
  async function (req, res) {
    const { appointmentId } = req.params;

    try {
      // Check if appointment_id exists
      const [appointmentRecordFound] = await pool().query(
        "SELECT * FROM appointments WHERE appointment_id = ?",
        [appointmentId]
      );

      if (appointmentRecordFound < 0) {
        return res.status(404).json({
          success: false,
          message: "Appointment record not found",
        });
      }

      // Update appointment_status_id to canceled in the db
      const [_updatedAppointment] = await pool().query(
        `UPDATE appointments 
        SET appointment_status_id = 3 
        WHERE appointment_id = ?`,
        [appointmentId]
      );

      return res.status(200).json({
        success: true,
        message: `Appointment cancelled successfully!`,
      });
    } catch (error) {
      console.log({ cancel_appointments_error: error.message });
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  }
);

module.exports = appointmentsRouter;
