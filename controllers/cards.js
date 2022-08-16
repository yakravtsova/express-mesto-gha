const Card = require('../models/card');
const mongoose = require('mongoose');

const { CardNotFound, NoAccessError } = require('../errors/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Error validating data" })
      }
      else {
        res.status(500).send({ message: "Internal error" })
      }
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new CardNotFound();
    })
    .then(card => {
      if (card.owner != req.user._id) {
        throw new NoAccessError();
      }
      return card.remove();
    })
    .then(card => {
      res.status(200).send(card)})
    .catch(err => {
      if (err.name === "NoAccessError") {
        res.status(err.status).send({message: err.message})
      }
      else if (err.name === "CardNotFound") {
        res.status(err.status).send({message: err.message})
      }
      else if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
        res.status(400).send({ message: "Error validating data" });
        return;
      }
      else {
        res.status(500).send({ message: "Internal error" })
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      throw new CardNotFound();
    })
    .then(cards => res.status(200).send(cards))
    .catch(err => {
      if (err.name === "CardNotFound") {
        res.status(err.status).send(err.message)
      }
      else {
        res.status(500).send({ message: "Internal error" })
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new CardNotFound();
    })
    .then(card => res.status(200).send(card))
    .catch(err => {
      if (err.name === "CardNotFound") {
        res.status(err.status).send({message: err.message})
      }
      else if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
        res.status(400).send({ message: "Error validating data" });
        return;
      }
      else {
        res.status(500).send({ message: "Internal error" })
      }
    });
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new CardNotFound();
    })
    .then(card => res.status(200).send(card))
    .catch(err => {
      if (err.name === "CardNotFound") {
        res.status(err.status).send({message: err.message})
      }
      else if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
        res.status(400).send({ message: "Error validating data" });
        return;
      }
      else {
        res.status(500).send({ message: "Internal error" })
      }
    });
}

module.exports = { createCard, deleteCard, getCards, likeCard, dislikeCard };