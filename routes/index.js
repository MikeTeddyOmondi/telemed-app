const router = require("express").Router();
const appRouter = require("./app");
const patientsRouter = require("./patients");
const usersRouter = require("./users");

router.use("/", appRouter)
router.use("/api/users", usersRouter);
router.use("/api/patients", patientsRouter);

module.exports = router;
