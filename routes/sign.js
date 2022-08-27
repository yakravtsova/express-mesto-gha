const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createUser, loginUser,
} = require('../controllers/users');

router.post('/users/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30)
      .default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30)
      .default('Исследователь'),
    avatar: Joi.string().regex(/[-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?/)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), createUser);
router.post('/users/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), loginUser);

module.exports = router;
