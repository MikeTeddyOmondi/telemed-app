const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();

const { pool } = require("../database/init");
const apiAuth = require("../middlewares/apiAuth");

// Login
usersRouter.post("/login", async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, error: "Please enter all fields!" });
  try {
    const [rows] = await pool().query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const userFound = rows[0];
    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (rows.length > 0) {
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials!" });
      }
      // set session
      req.session.userId = rows[0].user_id;
      return res
        .status(200)
        .json({ success: true, message: "Login successful!" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.log({ login_error: err.message });
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong!" });
  }
});

// Register
usersRouter.post("/signup", async function (req, res) {
  const { username, email, password } = req.body;
  // console.log({ username, email, password });
  if (!username || !email || !password)
    return res
      .status(400)
      .json({ success: false, error: "Please enter all fields!" });
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [rows] = await pool().query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res
        .status(500)
        .json({ success: false, error: "User already exists!" });
    }

    // TODO: this should be a transaction!!!
    const [userResult] = await pool().query(
      "INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)",
      [String(username).toLowerCase(), email, hashedPassword, 3]
    );
    const [patientResult] = await pool().query(
      "INSERT INTO patients (patient_id) VALUES (?)",
      [userResult.insertId]
    );
    req.session.userId = userResult.insertId;
    return res
      .status(200)
      .json({ success: true, message: "Signup successful!" });
  } catch (err) {
    console.log({ err });
    console.log({ registration_error: err.message });
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong!" });
  }
});

// GET Profile
usersRouter.get("/profile", apiAuth, async function (req, res) {
  const { userId } = req.session;

  try {
    const [rows] = await pool().query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);

    if (rows.length > 0) {
      const userFound = rows[0];
      const { password, ...profileData } = userFound;
      return res.status(200).json({
        success: true,
        message: "User profile found!",
        data: profileData,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.log({ profile_error: err.message });
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong!" });
  }
});

// PUT Profile
usersRouter.put("/profile", apiAuth, async function (req, res) {
  const { userId } = req.session;
  const { newUsername } = req.body;

  try {
    const [rows] = await pool().query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);

    if (rows.length > 0) {
      const [updatedRows] = await pool().query(
        "UPDATE users SET username = ? WHERE user_id = ?;",
        [newUsername, userId]
      );
      return res.status(200).json({
        success: true,
        message: "User profile updated!",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.log({ update_profile_error: err.message });
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
});

// DELETE Profile
usersRouter.delete("/profile", apiAuth, async function (req, res) {
  const { userId } = req.session;

  try {
    const [rows] = await pool().query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);

    if (rows.length > 0) {
      const [deletedRows] = await pool().query(
        "DELETE FROM users WHERE user_id = ?;",
        [userId]
      );
      console.log({ deletedRows });

      req.session.destroy((err) => {
        if (err) {
          throw new Error("Session invalidation failed");
        } else {
          res.clearCookie("user_sid");
          return res.status(200).json({
            success: true,
            message: "User profile deleted!",
          });
        }
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.log({ delete_profile_error: err.message });
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
});

// Logout
usersRouter.get("/logout", async function (req, res) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, error: "Logout failed" });
      } else {
        res.clearCookie("user_sid");
        return res
          .status(200)
          .json({ success: true, message: "Logout successful!" });
      }
    });
  }
});

module.exports = usersRouter;
