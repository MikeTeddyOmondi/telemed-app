// Check for authenticated user | middleware
const apiAuth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  return res.status(401).json({ success: false, error: "Unauthenticated" });
};

module.exports = apiAuth;
