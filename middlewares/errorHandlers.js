// error Handlers
const path = require("path");

// API 500 Error handler
const apiErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      code: err.code || "INTERNAL_ERROR",
      status,
    },
  });
};

// API 404 Error handler
const api404Handler = (req, res) => {
  res.status(404).json({
    error: {
      message: "API endpoint not found",
      code: "NOT_FOUND",
      status: 404,
    },
  });
};

// UI 404 Error handler
const web404Handler = (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "..", "public", "404.html"));
};

// 500 Catch-all error handler for UI routes
const webErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, "..", "public", "500.html"));
};

module.exports = {
  api404Handler,
  apiErrorHandler,
  web404Handler,
  webErrorHandler,
};
