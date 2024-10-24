const doctorsRouter = require("express").Router();

const { pool } = require("../database/init");
const apiAuth = require("../middlewares/apiAuth");
const docAuth = require("../middlewares/docAuth");

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
doctorsRouter.post("/add", docAuth, async function (req, res) {
  // TODO: check for existing user
});

module.exports = doctorsRouter;
