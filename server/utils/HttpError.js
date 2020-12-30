class HttpError extends Error {
  constructor(message, errorCode) {
    super();
    this.message =
      message || 'Something went wrong. Please try again.';
    this.status = errorCode || 500;
  }
}

module.exports = HttpError;
