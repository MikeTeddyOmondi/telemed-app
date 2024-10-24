const path = require("node:path");
const checkAuth = require("../middlewares/checkAuth");
const appRouter = require("express").Router();

appRouter.get("/", (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "home.html"));
});

appRouter.get("/login", (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "login.html"));
});

appRouter.get("/signup", (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "register.html"));
});

appRouter.get("/console", checkAuth, (req, res) => {
  return res
    .status(200)
    .sendFile(
      path.join(__dirname, "..", "public", "pages", "patients", "console.html")
    );
});

appRouter.get("/profile", checkAuth, (req, res) => {
  return res
    .status(200)
    .sendFile(
      path.join(__dirname, "..", "public", "pages", "patients", "profile.html")
    );
});

appRouter.get("/reschedule", checkAuth, (req, res) => {
  return res
    .status(200)
    .sendFile(
      path.join(
        __dirname,
        "..",
        "public",
        "pages",
        "patients",
        "reschedule.html"
      )
    );
});

appRouter.get("/settings", checkAuth, (req, res) => {
  return res
    .status(200)
    .sendFile(
      path.join(__dirname, "..", "public", "pages", "patients", "settings.html")
    );
});

appRouter.get("/appointments", checkAuth, (req, res) => {
  return res
    .status(200)
    .sendFile(
      path.join(__dirname, "..", "public", "pages", "doctors", "appointments.html")
    );
});

module.exports = appRouter;
