const patientsRouter = require("express").Router();

// Get all patients | Patients & Doctor/ADMINs ONLY
patientsRouter.get("/", async function (req, res) {});

// Update
patientsRouter.put("/", async function (req, res) {});

// Delete patients accounts | Patients & ADMINs only
patientsRouter.delete("/profile", async function (req, res) {});

module.exports = patientsRouter;
