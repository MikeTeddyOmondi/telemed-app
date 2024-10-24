const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");

// Enforce row-level security and RBAC for resources | middleware
const apiAuth = (req, res, next) => {
  // Check if JWT exists in the session
  if (!req.session.accessToken) {
    return res.status(401).json({ success: false, message: "Unauthenticated" });
  }

  // Verify the JWT
  jwt.verify(req.session.accessToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Attach decoded user information to the request object
    req.userInfo = decoded; // decoded contains userId and roleId

    const { account_id } = req.params;

    if (req.userInfo.roleId === 1) {
      // Admin access
      return next();
    }

    if (req.userInfo.roleId === 2) {
      // Doctor access
      return next();
    }

    if (req.userInfo.roleId === 3 && req.userInfo.userId === Number(account_id)) {
      // Patient access to their own records
      return next();
    }

    return res.status(403).json({ success: false, message: "Unauthorized" });
  });
};

module.exports = apiAuth;
