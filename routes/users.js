const router = require('express').Router();
const {
  userIdValidators, userDataValidators, userAvatarValidators,
} = require('../utils/validators');

const {
  getUser, getCurrentUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', userIdValidators, getUser);
router.patch('/users/me', userDataValidators, updateUser);
router.patch('/users/me/avatar', userAvatarValidators, updateAvatar);

module.exports = router;
