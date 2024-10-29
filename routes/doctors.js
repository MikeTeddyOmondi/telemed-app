const doctorsRouter = require("express").Router();

const { pool } = require("../database/init");
const { providerSchema } = require("../utils/schema");
const { createError } = require("../utils/createError");

// get all doctors from database
doctorsRouter.get("/", async function (req, res) {
  try {
    const [doctors] = await pool().query("SELECT * FROM doctors");

    if (doctors.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Doctors found!",
        data: doctors,
      });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Doctors not found", data: [] });
    }
  } catch (err) {
    console.log({ get_doctors_error: err.message });
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong!" });
  }
});

// create doctors - promote existing users to doctors
doctorsRouter.post("/add", async function (req, res, next) {
  const validatedProviderInfo = providerSchema.safeParse(req.body);

  if (!validatedProviderInfo.success) {
    return next(createError(400, "Invalid request body", "INVALID_DATA"));
  }

  const {
    username,
    primaryEmail,
    secondaryEmail,
    password,
    firstName,
    lastName,
    phoneNumber,
    specialty,
    dateJoined,
  } = validatedProviderInfo.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [rows] = await pool().query("SELECT * FROM users WHERE email = ?", [
      primaryEmail,
    ]);
    if (rows.length > 0) {
      return res
        .status(500)
        .json({ success: false, error: "User already exists!" });
    }

    // TODO: this should be a transaction!!!
    const [userResult] = await pool().query(
      "INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)",
      [String(username).toLowerCase(), primaryEmail, hashedPassword, 2]
    );
    const [providerResult] = await pool().query(
      `INSERT INTO doctors 
      (doctor_id, first_name, last_name, doctor_specialty, email_address, phone_number, date_joined) VALUES (?)`,
      [
        userResult.insertId,
        firstName,
        lastName,
        specialty,
        secondaryEmail,
        phoneNumber,
        dateJoined,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully!",
      data: { accountId: userResult.insertId },
    });
  } catch (err) {
    console.log({ doctor_creation_error: err.message });
    return next(createError(500, "Something went wrong!", "INTERNAL_ERROR"));
  }
});

module.exports = doctorsRouter;
