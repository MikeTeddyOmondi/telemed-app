class ApiError extends Error {
  status;
  code;

  constructor(message, status = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

const createError = (status, message) => {
  const err = new ApiError(status, message);
  return err;
};

module.exports = { createError, ApiError };
