const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;
  try {
    payload = jwt.verify(token, 'verysecretjwtkey');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
