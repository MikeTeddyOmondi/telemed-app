const patientsRouter = require("express").Router();

// Get all patients info | Patient / Doctor / Admins ONLY
patientsRouter.get("/", async function (req, res) {});

// Get one patient's info | Patient / Doctor / Admins ONLY
patientsRouter.get("/:patient_id", async function (req, res) {});

// Update one patient's info | Patient / Doctor / Admins ONLY
patientsRouter.put("/:patient_id", async function (req, res) {});

// Delete one patient's info | Patient / Doctor / Admins ONLY
// patientsRouter.delete("/profile", async function (req, res) {});

module.exports = patientsRouter;
