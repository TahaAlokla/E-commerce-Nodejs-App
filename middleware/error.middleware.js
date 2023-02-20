const ApiError = require("../utils/apiError");

/* eslint-disable no-use-before-define */
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    devMode(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      err = jwtHandlerSignatureErrorMassage();
    }
    if (err.name === "TokenExpiredError") {
      err = jwtTokenExpiredError();
    }
    productionMode(err, res);
  }
};

const jwtHandlerSignatureErrorMassage = () =>
  new ApiError("invalid signature token received", 401);
const jwtTokenExpiredError = () => new ApiError(" token expired time  ", 401);

const devMode = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const productionMode = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
module.exports = globalError;
