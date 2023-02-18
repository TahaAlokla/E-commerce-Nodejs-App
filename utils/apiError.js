// @desc this class for operational Error |  any Error can predict
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.Operational = true;
  }
}

// export default ApiError
module.exports = ApiError;
