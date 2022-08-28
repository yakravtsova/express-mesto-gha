const router = require('express').Router();
const { cardIdValidators, cardValidators } = require('../utils/validators');

const {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', cardIdValidators, deleteCard);
router.post('/cards', cardValidators, createCard);
router.put('/cards/:cardId/likes', cardIdValidators, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidators, dislikeCard);

module.exports = router;
