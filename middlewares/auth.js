const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  /* if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  } */

  let payload;
  try {
    payload = jwt.verify(token, 'verysecretjwtkey');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
