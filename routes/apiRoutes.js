const apiRouter = require("express").Router();

const usersRouter = require("./users");
const doctorsRouter = require("./doctors");
const patientsRouter = require("./patients");
const appointmentsRouter = require("./appointments");

const apiAuth = require("../middlewares/apiAuth");
const {
  api404Handler,
  apiErrorHandler,
} = require("../middlewares/errorHandlers");

apiRouter.use("/users", usersRouter); // managing users
apiRouter.use("/:account_id/doctors", apiAuth, doctorsRouter); // managing doctors
apiRouter.use("/:account_id/patients", patientsRouter); // patients routes
apiRouter.use("/:account_id/appointments", apiAuth, appointmentsRouter); // managing appointments

apiRouter.use(api404Handler);
apiRouter.use(apiErrorHandler);

module.exports = apiRouter;
