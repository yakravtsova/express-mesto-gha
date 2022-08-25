const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  createUser, loginUser, getUser, getCurrentUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.post('/users/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30)
      .default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30)
      .default('Исследователь'),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), createUser);
router.post('/users/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/),
    password: Joi.string().required(),
  }),
}), loginUser);
router.get('/users', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:userId', auth, getUser);
router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateAvatar);

module.exports = router;
