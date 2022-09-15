const jwt = require('jsonwebtoken');

// const { JWT_SECRET } = process.env;
const JWT_SECRET = 'verysecretjwtkey';
const { UnauthorizedError } = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  /* const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, 'verysecretjwtkey');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next(); */
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
