const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");
const { pool } = require("../database/init");

// Check for authenticated user | middleware
const checkDocAuth = async (req, res, next) => {
  // Check if JWT exists in the session
  if (!req.session.accessToken) {
    return res.redirect("/login");
  }

  // Verify the JWT
  jwt.verify(req.session.accessToken, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.redirect("/login");
    }

    // Attach decoded user information to the request object
    req.userInfo = decoded; // decoded contains userId and roleId

    // quick read from the db | TODO: refactor
    const [rows] = await pool().query("SELECT * FROM users WHERE user_id = ?", [
      req.userInfo.userId,
    ]);

    if (rows.length == 0) {
      return res.redirect("/login");
    }

    const userFound = rows[0];

    if (req.userInfo.roleId === 1) {
      // Admin access
      return next();
    }

    if (
      req.userInfo.roleId === 2 &&
      req.userInfo.userId === userFound.user_id
    ) {
      // Doctor access
      return next();
    }

    return res.redirect("/login");
  });
};

module.exports = checkDocAuth;
