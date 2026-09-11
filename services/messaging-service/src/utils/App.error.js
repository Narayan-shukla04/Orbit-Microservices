class AppError extends Error {
  constructor(statuscode, message) {
    (super(message), (this.statuscode = statuscode),(this.isOperational = true));
  }
}


export default AppError