const path = require("node:path");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");
const { pool } = require("../database/init");

const checkAuth = require("../middlewares/checkAuth");
const checkAdminAuth = require("../middlewares/checkAdminAuth");
const checkDocAuth = require("../middlewares/checkDocAuth");

const appRouter = require("express").Router();

appRouter.get("/", (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "home.html"));
});

appRouter.get("/login", (req, res) => {
  // Check if JWT exists in the session
  if (!req.session.accessToken) {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "..", "public", "login.html"));
  }

  // Verify the JWT
  jwt.verify(req.session.accessToken, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res
        .status(200)
        .sendFile(path.join(__dirname, "..", "public", "login.html"));
    }

    // Attach decoded user information to the request object
    req.userInfo = decoded; // decoded contains userId and roleId

    // quick read from the db | TODO: refactor
    const [rows] = await pool().query("SELECT * FROM users WHERE user_id = ?", [
      req.userInfo.userId,
    ]);

    if (rows.length == 0) {
      return res
        .status(200)
        .sendFile(path.join(__dirname, "..", "public", "login.html"));
    }

    const userFound = rows[0];

    if (
      req.userInfo.roleId === 1 &&
      req.userInfo.userId === userFound.user_id
    ) {
      // redirect to admin console
      return res.redirect("/admin-console");
    }

    if (
      req.userInfo.roleId === 2 &&
      req.userInfo.userId === userFound.user_id
    ) {
      // redirect to  doctor console
      return res.redirect("/applications");
    }

    if (
      req.userInfo.roleId === 3 &&
      req.userInfo.userId === userFound.user_id
    ) {
      // redirect to patient's console
      return res.redirect("/console");
    }

    return res
      .status(200)
      .sendFile(path.join(__dirname, "..", "public", "login.html"));
  });
});

appRouter.get("/signup", (req, res) => {
  // Check if JWT exists in the session
  if (!req.session.accessToken) {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "..", "public", "register.html"));
  }

  // Verify the JWT
  jwt.verify(req.session.accessToken, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res
        .status(200)
        .sendFile(path.join(__dirname, "..", "public", "register.html"));
    }

    // Attach decoded user information to the request object
    req.userInfo = decoded; // decoded contains userId and roleId

    // quick read from the db | TODO: refactor
    const [rows] = await pool().query("SELECT * FROM users WHERE user_id = ?", [
      req.userInfo.userId,
    ]);

    if (rows.length == 0) {
      return res
        .status(200)
        .sendFile(path.join(__dirname, "..", "public", "register.html"));
    }
    
    const userFound = rows[0];

    if (
      req.userInfo.roleId === 1 &&
      req.userInfo.userId === userFound.user_id
    ) {
      // redirect to admin console
      return res.redirect("/admin-console");
    }

    if (
      req.userInfo.roleId === 2 &&
      req.userInfo.userId === userFound.user_id
    ) {
      // redirect to  doctor console
      return res.redirect("/applications");
    }

    if (
      req.userInfo.roleId === 3 &&
      req.userInfo.userId === userFound.user_id
    ) {
      // redirect to patient's console
      return res.redirect("/console");
    }

    return res
      .status(200)
      .sendFile(path.join(__dirname, "..", "public", "register.html"));
  });
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

appRouter.get("/appointments", checkDocAuth, (req, res) => {
  return res
    .status(200)
    .sendFile(
      path.join(
        __dirname,
        "..",
        "public",
        "pages",
        "doctors",
        "appointments.html"
      )
    );
});

appRouter.get("/admin-console", checkAdminAuth, (req, res) => {
  return res
    .status(200)
    .sendFile(
      path.join(
        __dirname,
        "..",
        "public",
        "pages",
        "admin",
        "console.html"
      )
    );
});

module.exports = appRouter;
