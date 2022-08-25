const { ApplicationError } = require('./ApplicationError');

class ForbiddenError extends ApplicationError {
  constructor() {
    super(403, 'You can not delete not yours cards');
  }
}

module.exports = {
  ForbiddenError,
};
