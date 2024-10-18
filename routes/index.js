const router = require("express").Router();

const appRouter = require("./app");
const usersRouter = require("./users");
const doctorsRouter = require("./doctors");
const patientsRouter = require("./patients");
const appointmentsRouter = require("./appointments");

router.use("/", appRouter) // frontend routes
router.use("/api/users", usersRouter); // managing users
router.use("/api/doctors", doctorsRouter); // managing doctors
router.use("/api/patients", patientsRouter); // patients routes
router.use("/api/appointments", appointmentsRouter); // managing appointments

module.exports = router;
