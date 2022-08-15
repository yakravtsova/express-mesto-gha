const User = require('../models/user');
const { UserNotFound } = require('../errors/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(201).send(user))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Error validating data" })
      }
      else {
        res.status(500).send({ message: "Error creating user" })
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new UserNotFound();
    })
    .then(users => res.status(200).send(users))
    .catch(err => {
      if (err.name === "UserNotFound") {
        res.status(err.status).send(err.message)
      }
      else {
        res.status(500).send({ message: "Error getting user" })
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then(user => res.status(200).send(user))
    .catch(err => {
      if (err.name === "UserNotFound") {
        res.status(err.status).send(err.message)
      }
      else {
        res.status(500).send({ message: "Error getting user" })
      }
    });
}

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then(user => res.status(200).send(user))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Error validating data" })
      }
      else if (err.name === "UserNotFound") {
        res.status(err.status).send(err.message)
      }
      else {
        res.status(500).send({ message: "Error updating user" })
      }
    });
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then(user => res.status(200).send(user))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Error validating data" })
      }
      else if (err.name === "UserNotFound") {
        res.status(err.status).send(err.message)
      }
      else {
        res.status(500).send({ message: "Error updating avatar" })
      }
    });
}

module.exports = { createUser, getUser, getUsers, updateUser, updateAvatar };