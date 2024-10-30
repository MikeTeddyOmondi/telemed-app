const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersRouter = require("express").Router();

const { pool } = require("../database/init");
const apiAuth = require("../middlewares/apiAuth");
const { JWT_SECRET } = require("../config");

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
    if (rows.length > 0) {
      const isPasswordValid = await bcrypt.compare(
        password,
        userFound.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials!" });
      }

      // set session
      // Create the payload for the JWT
      const payload = {
        userId: userFound.user_id,
        roleId: userFound.role_id,
      };

      // Sign the JWT
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      // Store the JWT in the session
      // req.session.userId = rows[0].user_id;
      req.session.accessToken = token;

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        data: { accountId: userFound.user_id },
      });
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

    const [newUser] = await pool().query(
      "SELECT * FROM users WHERE user_id = ?",
      [userResult.insertId]
    );

    // set session
    // Create the payload for the JWT
    const payload = {
      userId: newUser[0].user_id,
      roleId: newUser[0].role_id,
    };

    // Sign the JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Store the JWT in the session
    // req.session.userId = userResult.insertId;
    req.session.accessToken = token;

    return res.status(200).json({
      success: true,
      message: "Signup successful!",
      data: { accountId: newUser[0].user_id },
    });
  } catch (err) {
    console.log({ err });
    console.log({ registration_error: err.message });
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong!" });
  }
});

// GET Profile
usersRouter.get("/:account_id/profile", apiAuth, async function (req, res) {
  const { userId } = req.userInfo;

  try {
    const [rows] = await pool().query(
      `SELECT user_id, u.role_id, email, username, role 
        FROM users as u
        LEFT JOIN roles
        ON roles.role_id = u.role_id
        WHERE user_id = ?`,
      [userId]
    );

    if (rows.length > 0) {
      const profileData = rows[0];
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
usersRouter.put("/:account_id/profile", apiAuth, async function (req, res) {
  const { userId } = req.userInfo;
  const { newUsername, firstName, lastName, date_of_birth, gender, language } =
    req.body;

  try {
    const [rows] = await pool().query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);

    if (rows.length > 0) {
      // update user details record
      const [updatedUserDetails] = await pool().query(
        "UPDATE users SET username = ? WHERE user_id = ?;",
        [newUsername, userId]
      );

      // update patient details record
      const [updatedPatientDetails] = await pool().query(
        `UPDATE patients 
          SET first_name = ?, 
              last_name = ?, 
              date_of_birth = ?,
              gender = ?, 
              language = ? 
        WHERE patient_id = ?;`,
        [firstName, lastName, date_of_birth, gender, language, userId]
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
usersRouter.delete("/:account_id/profile", apiAuth, async function (req, res) {
  const { userId } = req.userInfo;

  try {
    const [rows] = await pool().query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);

    if (rows.length > 0) {
      const [deletedRows] = await pool().query(
        "DELETE FROM users WHERE user_id = ?;",
        [userId]
      );

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
