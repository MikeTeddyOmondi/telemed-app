// Check for authenticated user | middleware
const checkAuth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  return res.redirect("/login");
};

module.exports = checkAuth;