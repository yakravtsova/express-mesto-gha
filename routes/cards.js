const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getCards);
router.delete('/cards/:cardId', auth, deleteCard);
router.post('/cards', auth, createCard);
router.put('/cards/:cardId/likes', auth, likeCard);
router.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = router;
