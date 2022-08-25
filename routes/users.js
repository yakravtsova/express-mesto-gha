const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createUser, loginUser, getUser, getCurrentUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.post('/users/signup', createUser);
router.post('/users/signin', loginUser);
router.get('/users', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:userId', auth, getUser);
router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateAvatar);

module.exports = router;
