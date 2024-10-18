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
    .sendFile(path.join(__dirname, "..", "public", "pages", "patients", "profile.html"));
});

module.exports = appRouter;

// https://www.brooker.co.za/blog/2023/03/23/economics.html