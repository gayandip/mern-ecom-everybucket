class ApiError extends Error {
  constructor(statusCode, message = "some error occured") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export { ApiError };
