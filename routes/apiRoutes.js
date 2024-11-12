const apiRouter = require("express").Router();

const usersRouter = require("./users");
const publicApiRouter = require("./public");
const doctorsRouter = require("./doctors");
const patientsRouter = require("./patients");
const appointmentsRouter = require("./appointments");

const apiAuth = require("../middlewares/apiAuth");
const {
  api404Handler,
  apiErrorHandler,
} = require("../middlewares/errorHandlers");

apiRouter.use("/new-contact", publicApiRouter); // managing users
apiRouter.use("/users", usersRouter); // managing users
apiRouter.use("/:account_id/doctors", apiAuth, doctorsRouter); // managing doctors
apiRouter.use("/:account_id/patients", patientsRouter); // patients routes
apiRouter.use("/:account_id/appointments", apiAuth, appointmentsRouter); // managing appointments

apiRouter.use(api404Handler);
apiRouter.use(apiErrorHandler);

module.exports = apiRouter;
