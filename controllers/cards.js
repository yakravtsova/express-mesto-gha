const mongoose = require('mongoose');
const Card = require('../models/card');

const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { ValidationError } = require('../errors/ValidationError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new ValidationError('Некорректный идентификатор карточки');
  }
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      const cardOwner = card.owner;
      const userId = req.user._id;
      if (cardOwner !== userId) {
        throw new ForbiddenError('Вы можете удалять только свои карточки');
      }
      return card.remove();
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new NotFoundError('Карточки не найдены');
    })
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new ValidationError('Некорректный идентификатор карточки');
  }
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.status(200).send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new ValidationError('Некорректный идентификатор карточки');
  }
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.status(200).send(card))
    .catch(next);
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
