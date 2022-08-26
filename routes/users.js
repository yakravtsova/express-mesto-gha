const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  createUser, loginUser, getUser, getCurrentUser, getUsers, updateUser, updateAvatar,
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
router.get('/users', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:userId', auth, getUser);
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/[-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?/),
  }),
}), updateAvatar);

module.exports = router;
