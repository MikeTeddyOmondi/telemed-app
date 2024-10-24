const router = require("express").Router();

const appRouter = require("./app");
const usersRouter = require("./users");
const doctorsRouter = require("./doctors");
const patientsRouter = require("./patients");
const appointmentsRouter = require("./appointments");

const apiAuth = require("../middlewares/apiAuth");

router.use("/", appRouter) // frontend routes
router.use("/api/users", usersRouter); // managing users
router.use("/api/:account_id/doctors", apiAuth, doctorsRouter); // managing doctors
router.use("/api/:account_id/patients", patientsRouter); // patients routes
router.use("/api/:account_id/appointments", apiAuth, appointmentsRouter); // managing appointments

module.exports = router;
