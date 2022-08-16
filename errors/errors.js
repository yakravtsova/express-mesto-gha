class ApplicationError extends Error {
  constructor(status = 500, message = "Internal error") {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor)
  }
}

class UserNotFound extends ApplicationError {
  constructor() {
    super(404, "User not found")
  }
}

class CardNotFound extends ApplicationError {
  constructor() {
    super(404, "Card not found")
  }
}

class PageNotFound extends ApplicationError {
  constructor() {
    super(404, "User not found")
  }
}

class NoAccessError extends ApplicationError {
  constructor() {
    super(403, "You can't delete a non-your card")
  }
}

class ValidationError extends ApplicationError {
  constructor() {
    super(400, "Error validating data")
  }
}

module.exports = { UserNotFound, CardNotFound, PageNotFound, NoAccessError, ValidationError }