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

// check is user has authenticated
appRouter.get("/profile", checkAuth, (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "profile.html"));
});

module.exports = appRouter;
